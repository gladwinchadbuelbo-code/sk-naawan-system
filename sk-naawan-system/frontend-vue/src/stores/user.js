import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('sk_user')) || null)
  const token = ref(localStorage.getItem('sk_token') || null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const role = computed(() => {
    if (!user.value) return 'SK Chairperson'
    const rolesMap = {
      'chairperson': 'SK Chairperson',
      'treasurer': 'SK Treasurer',
      'secretary': 'SK Secretary',
      'public_viewer': 'Public Viewer',
      'SK Chairperson': 'SK Chairperson',
      'SK Secretary': 'SK Secretary',
      'SK Treasurer': 'SK Treasurer',
      'Public Viewer': 'Public Viewer'
    }
    return rolesMap[user.value.role] || user.value.role
  })
  const name = computed(() => user.value?.full_name || 'Juan Dela Cruz')

  function setUser(userData, userToken) {
    user.value = userData
    token.value = userToken || `mock_token_${userData.role || 'chairperson'}`
    localStorage.setItem('sk_user', JSON.stringify(userData))
    localStorage.setItem('sk_token', token.value)
  }

  function setRole(newRole) {
    // Helper to dynamically switch role contexts in the frontend
    const rolesMap = {
      'SK Chairperson': 'chairperson',
      'SK Secretary': 'secretary',
      'SK Treasurer': 'treasurer',
      'Public Viewer': 'public_viewer'
    }
    const internalRole = rolesMap[newRole] || newRole
    const nameMap = {
      'chairperson': 'Juan Dela Cruz',
      'secretary': 'Pedro Reyes',
      'treasurer': 'Maria Santos',
      'public_viewer': 'Guest User'
    }
    user.value = {
      id: internalRole === 'chairperson' ? 1 : internalRole === 'treasurer' ? 2 : 3,
      full_name: nameMap[internalRole] || 'Guest User',
      username: `sk_${internalRole}`,
      role: internalRole,
      email: `${internalRole}@sknaawan.gov.ph`
    }
    token.value = `mock_token_${internalRole}`
    localStorage.setItem('sk_user', JSON.stringify(user.value))
    localStorage.setItem('sk_token', token.value)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('sk_user')
    localStorage.removeItem('sk_token')
  }

  return { user, token, role, name, isAuthenticated, setUser, setRole, logout }
})
