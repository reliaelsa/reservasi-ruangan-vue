<template>
  <div class="relative min-h-screen bg-gray-100">
    <!-- Navbar (muncul hanya jika bukan di login/register) -->
    <Navbar
      v-if="showLayout"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Overlay gelap -->
    <transition name="fade">
      <div
        v-if="showLayout && isSidebarOpen"
        @click="toggleSidebar"
        class="fixed inset-0 bg-black bg-opacity-40 z-30"
      ></div>
    </transition>

    <!-- Sidebar -->
    <transition name="slide">
      <Sidebar
        v-if="showLayout && isSidebarOpen"
        class="z-40"
        @close="toggleSidebar"
      />
    </transition>

    <!-- Konten utama -->
    <main :class="[showLayout ? 'pt-24 px-6 pb-10' : 'p-0']" class="transition-all duration-300">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const route = useRoute()

// Sembunyikan navbar & sidebar di halaman login / register
const showLayout = computed(() => !['/login', '/register'].includes(route.path))
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
