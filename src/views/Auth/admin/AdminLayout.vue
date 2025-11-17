<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <Sidebar :isOpen="isSidebarOpen" />

    <!-- Konten -->
    <div class="flex-1 flex flex-col transition-all duration-300">
      <Navbar @toggle-sidebar="toggleSidebar" />

      <main class="pt-24 px-6 pb-10">
        <router-view />
      </main>

      <footer class="bg-white text-center py-3 text-sm text-gray-600 border-t mt-6">
        © 2025 - 2030 Reservasi Ruangan
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>
