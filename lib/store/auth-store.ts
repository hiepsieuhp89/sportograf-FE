import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from 'firebase/auth'

interface AuthState {
  user: User | null
  isAdmin: boolean
  setUser: (user: User | null) => void
  setIsAdmin: (isAdmin: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      setUser: (user) => set({ user }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      clearAuth: () => set({ user: null, isAdmin: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAdmin: state.isAdmin }),
    }
  )
) 