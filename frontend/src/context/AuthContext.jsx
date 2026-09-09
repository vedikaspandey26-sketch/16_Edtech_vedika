import { createContext, useContext, useState } from 'react'
import { mockLogin } from '../services/api'
const AuthContext = createContext(null)
const KEY = 'studymate_demo_user'
export function AuthProvider({ children }) { const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null } }); const login = async (name, email) => { let next; try { next = await mockLogin(name, email) } catch (error) { if (email.toLowerCase() !== 'demo@studymate.ai') throw error; next = { userId: 'demo-user', id: 'demo-user', name: name || 'Ava Sharma', email, avatarSeed: 'Ava Sharma', token: 'mock-offline-demo', preferences: { defaultLevel: 'Beginner', dailyMinutes: 20 }, offlineDemo: true } } localStorage.setItem(KEY, JSON.stringify(next)); setUser(next); return next }; const logout = () => { localStorage.removeItem(KEY); setUser(null) }; return <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider> }
export const useAuth = () => useContext(AuthContext)
