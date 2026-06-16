import create from 'zustand'

let timeoutId = null

const useNotificationStore = create((set) => ({
  notification: null,
  setNotification: (message, type = 'success', ttl = 5000) => {
    set({ notification: { message, type } })
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => set({ notification: null }), ttl)
  },
  clear: () => {
    if (timeoutId) clearTimeout(timeoutId)
    set({ notification: null })
  }
}))

export default useNotificationStore
