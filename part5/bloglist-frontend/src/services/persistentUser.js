const STORAGE_KEY = 'loggedBlogUser'

export const getUser = () => {
  const json = window.localStorage.getItem(STORAGE_KEY)
  return json ? JSON.parse(json) : null
}

export const saveUser = (user) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export const removeUser = () => {
  window.localStorage.removeItem(STORAGE_KEY)
}

export default { getUser, saveUser, removeUser }
