<script setup>
import { ref, onMounted } from 'vue'

// Ambil nama user dari localStorage
const userName = ref('Pengguna')

onMounted(() => {
  const savedName = localStorage.getItem('name') // ✅ key sama dengan Login.vue
  if (savedName) {
    userName.value = savedName
  }
})
</script>

<template>
  <nav class="bg-white shadow-md fixed top-0 left-0 right-0 z-20">
    <div class="px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center h-20">

      <div class="flex items-center">
        <button @click="$emit('toggle-sidebar')" class="text-gray-600 hover:text-gray-800 p-2 -ml-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <div class="flex items-center ml-4">
          <img src="@/assets/logo2.jpg" alt="Reservasi Ruangan Logo" class="h-16 object-contain" style="width: auto;" />
        </div>
      </div>

      <!-- Profil pengguna -->
      <button class="flex items-center space-x-2 bg-gray-200 rounded-full p-1 pl-4 hover:bg-gray-300 transition duration-150 shadow-sm">
        <span class="text-gray-700 font-semibold text-sm">Hi, {{ userName }}</span>
        <div class="rounded-full w-8 h-8 bg-blue-600 flex items-center justify-center text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5.121 17.804A13.938 13.938 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </button>
    </div>
    <hr class="border-gray-300">
  </nav>
</template>
