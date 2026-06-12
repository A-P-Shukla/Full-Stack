import { test, expect } from '@playwright/test'

const FRONTEND = 'http://localhost:5173'
const API = 'http://127.0.0.1:3003'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    // reset backend state
    await request.post(`${API}/api/testing/reset`)
    // create a user
    const user = { name: 'Test User', username: 'testuser', password: 'secret' }
    await request.post(`${API}/api/users`, { data: user })
    await page.goto(FRONTEND + '/login', { waitUntil: 'networkidle' })
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('text=Log in to application')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('#username')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('#password')).toBeVisible({ timeout: 10000 })
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.waitForSelector('#username', { timeout: 10000 })
      await page.fill('#username', 'testuser')
      await page.fill('#password', 'secret')
      await page.click('#login-button')
      await expect(page.locator('text=Test User (logout)')).toBeVisible({ timeout: 10000 })
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.waitForSelector('#username', { timeout: 10000 })
      await page.fill('#username', 'testuser')
      await page.fill('#password', 'wrong')
      await page.click('#login-button')
      await expect(page.locator('text=invalid username or password')).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page, request }) => {
      // login via API to obtain token and set localStorage
      const loginRes = await request.post(`${API}/api/login`, { data: { username: 'testuser', password: 'secret' } })
      const body = await loginRes.json()
      await page.addInitScript((user) => {
        window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      }, body)
      await page.goto(FRONTEND + '/', { waitUntil: 'networkidle' })
    })

    test('a new blog can be created', async ({ page }) => {
      const title = `E2E Blog ${Date.now()}`
      await page.goto(FRONTEND + '/create')
      await page.fill('#title', title)
      await page.fill('#author', 'E2E Author')
      await page.fill('#url', 'http://e2e.test')
      await page.click('#create-button')
      await expect(page.locator(`[data-testid="blog-summary-${title}"]`)).toBeVisible()
    })

    test('a blog can be liked', async ({ page, request }) => {
      // create a blog via API for speed
      const title = `Likeable ${Date.now()}`
      const loginRes = await request.post(`${API}/api/login`, { data: { username: 'testuser', password: 'secret' } })
      const token = (await loginRes.json()).token
      await request.post(`${API}/api/blogs`, { data: { title, author: 'Liker', url: 'http://like.test' }, headers: { authorization: `bearer ${token}` } })
      await page.goto(FRONTEND + '/')
      const blog = page.locator(`[data-testid="blog-${title}"]`)
      await blog.locator('text=view').click()
      await blog.locator(`[data-testid="blog-likes-${title}"]`).locator('button', { hasText: 'like' }).click()
      await expect(blog.locator(`[data-testid="blog-likes-${title}"]`, { hasText: 'likes 1' })).toBeVisible()
    })

    test('user who added blog can delete it', async ({ page, request }) => {
      const title = `Deletable ${Date.now()}`
      const loginRes = await request.post(`${API}/api/login`, { data: { username: 'testuser', password: 'secret' } })
      const token = (await loginRes.json()).token
      await request.post(`${API}/api/blogs`, { data: { title, author: 'Owner', url: 'http://delete.test' }, headers: { authorization: `bearer ${token}` } })
      await page.goto(FRONTEND + '/')
      const blog = page.locator(`[data-testid="blog-${title}"]`)
      await blog.locator('text=view').click()
      page.on('dialog', async dialog => { await dialog.accept() })
      await blog.locator(`[data-testid="blog-remove-${title}"]`).click()
      await expect(page.locator(`[data-testid="blog-${title}"]`)).toHaveCount(0)
    })

    test('only creator sees delete button', async ({ page, request }) => {
      const loginRes = await request.post(`${API}/api/login`, { data: { username: 'testuser', password: 'secret' } })
      const token = (await loginRes.json()).token
      await request.post(`${API}/api/blogs`, { data: { title: 'PrivateDelete', author: 'Owner', url: 'http://private.test' }, headers: { authorization: `bearer ${token}` } })
      // create another user
      await request.post(`${API}/api/users`, { data: { name: 'Other', username: 'other', password: 'pass' } })
      // login as other user
      const otherLogin = await request.post(`${API}/api/login`, { data: { username: 'other', password: 'pass' } })
      const otherBody = await otherLogin.json()
      await page.addInitScript((user) => { window.localStorage.setItem('loggedBlogUser', JSON.stringify(user)) }, otherBody)
      await page.goto(FRONTEND + '/', { waitUntil: 'networkidle' })
      const blog = page.locator('.blog', { hasText: 'PrivateDelete' }).first()
      await blog.waitFor({ state: 'visible', timeout: 10000 })
      await blog.locator('text=view').click()
      // remove button should not be visible for other user
      const remove = blog.locator(`[data-testid="blog-remove-PrivateDelete"]`)
      await expect(remove).toHaveCount(0)
    })

    test('blogs are ordered by likes', async ({ page, request }) => {
      const loginRes = await request.post(`${API}/api/login`, { data: { username: 'testuser', password: 'secret' } })
      const token = (await loginRes.json()).token
      // create multiple blogs with different like counts
      await request.post(`${API}/api/blogs`, { data: { title: 'Most', author: 'A', url: 'http://most', likes: 5 }, headers: { authorization: `bearer ${token}` } })
      await request.post(`${API}/api/blogs`, { data: { title: 'Least', author: 'B', url: 'http://least', likes: 1 }, headers: { authorization: `bearer ${token}` } })
      await request.post(`${API}/api/blogs`, { data: { title: 'Middle', author: 'C', url: 'http://middle', likes: 3 }, headers: { authorization: `bearer ${token}` } })
      await page.goto(FRONTEND + '/')
      // check order: Most, Middle, Least
      const blogs = page.locator('.blog')
      const count = await blogs.count()
      const items = []
      for (let i = 0; i < count; i++) {
        const b = blogs.nth(i)
        await b.locator('text=view').click()
        const title = await b.locator('.blogSummary').textContent()
        const likesText = await b.locator('.blogLikes').textContent()
        const likesMatch = likesText && likesText.match(/likes\s*(\d+)/)
        const likes = likesMatch ? Number(likesMatch[1]) : 0
        items.push({ title, likes })
      }
      // check descending order by likes
      for (let i = 1; i < items.length; i++) {
        expect(items[i-1].likes).toBeGreaterThanOrEqual(items[i].likes)
      }
    })
  })
})
