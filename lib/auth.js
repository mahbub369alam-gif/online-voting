import { findUserByEmail } from "./mock-data.js"

// Simple session management (in production, use proper JWT or session management)
let currentUser = null

export const login = async (email, password) => {
  const user = findUserByEmail(email)

  if (!user) {
    return { error: "User not found" }
  }

  // In production, compare hashed passwords
  if (user.password !== password) {
    return { error: "Invalid password" }
  }

  // Set current user (in production, create JWT token)
  currentUser = { ...user }
  delete currentUser.password // Don't expose password

  return { success: true, user: currentUser }
}

export const logout = () => {
  currentUser = null
  return { success: true }
}

export const getCurrentUser = () => {
  return currentUser
}

export const isAuthenticated = () => {
  return currentUser !== null
}

export const isAdmin = () => {
  return currentUser && currentUser.role === "admin"
}

export const isVoter = () => {
  return currentUser && currentUser.role === "voter"
}

export const requireAuth = (requiredRole = null) => {
  if (!isAuthenticated()) {
    return { error: "Authentication required" }
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return { error: "Insufficient permissions" }
  }

  return { success: true, user: currentUser }
}
