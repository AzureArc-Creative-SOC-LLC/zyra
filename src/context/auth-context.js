import { createContext, useContext } from 'react'

export const AuthContext = createContext({
  user: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refresh: async () => {},
})

export const useAuth = () => useContext(AuthContext)
