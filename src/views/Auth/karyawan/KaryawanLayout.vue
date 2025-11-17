<template>
  <div class="min-h-screen bg-gray-100 flex">

    <!-- SIDEBAR -->
    <KaryawanSidebar :isOpen="isSidebarOpen" />

    <!-- KONTEN -->
    <div class="flex-1 flex flex-col transition-all duration-300">

      <!-- NAVBAR -->
      <KaryawanNavbar @toggle-sidebar="toggleSidebar" />

      <!-- ISI HALAMAN -->
      <main class="pt-24 px-6 pb-10">
        <router-view />
      </main>

      <!-- FOOTER -->
      <footer class="bg-white text-center py-3 text-sm text-gray-600 border-t mt-6">
        © 2025 - 2030 Reservasi Ruangan
      </footer>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue"

// 🔥 Path di FIX sesuai struktur kamu
import KaryawanNavbar from "@/components/icons/karyawan/KaryawanNavbar.vue"
import KaryawanSidebar from "@/components/icons/karyawan/KaryawanSidebar.vue"

const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>
