<template>
  <div class="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4">Test Supabase Connection</h2>
    <form @submit.prevent="saveUser">
      <div class="mb-4">
        <label class="block text-gray-700">Name</label>
        <input v-model="form.name" type="text" class="w-full border rounded p-2" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Email</label>
        <input v-model="form.email" type="email" class="w-full border rounded p-2" required />
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" :disabled="loading">
        <span v-if="loading">Saving...</span>
        <span v-else>Save User</span>
      </button>
    </form>
    <p v-if="message" class="mt-4 p-2 rounded" :class="isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: ''
})

const message = ref('')
const isError = ref(false)
const loading = ref(false)

const saveUser = async () => {
  loading.value = true
  message.value = ''
  
  try {
    const response = await fetch('http://127.0.0.1:5000/api/saveUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save user')
    }
    
    message.value = 'User saved successfully!'
    isError.value = false
    form.value.name = ''
    form.value.email = ''
  } catch (error) {
    message.value = error.message
    isError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Optional styles */
</style>
