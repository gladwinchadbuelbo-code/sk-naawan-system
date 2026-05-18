import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('sk_user')) || null)
  const token = ref(localStorage.getItem('sk_token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const role = computed(() => {
    if (!user.value) return 'Public Viewer'
    const rolesMap = {
      'chairperson': 'SK Chairperson',
      'treasurer': 'SK Treasurer',
      'secretary': 'SK Secretary',
      'public_viewer': 'Public Viewer'
    }
    return rolesMap[user.value.role] || user.value.role
  })
  const name = computed(() => user.value?.full_name || 'Guest')

  function setUser(userData, userToken) {
    user.value = userData
    token.value = userToken
    localStorage.setItem('sk_user', JSON.stringify(userData))
    localStorage.setItem('sk_token', userToken)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('sk_user')
    localStorage.removeItem('sk_token')
  }

  return { user, token, role, name, isAuthenticated, setUser, logout }
})
