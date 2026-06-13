import create from 'zustand'

let timeoutId = null

const useNotificationStore = create((set) => ({
  message: '',
  setNotification: (msg, ttl = 5000) => {
    set({ message: msg })
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => set({ message: '' }), ttl)
  },
  clear: () => {
    if (timeoutId) clearTimeout(timeoutId)
    set({ message: '' })
  }
}))

export default useNotificationStore
