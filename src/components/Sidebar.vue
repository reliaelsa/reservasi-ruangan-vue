<template>
  <transition name="slide-fade">
    <aside
      v-if="isOpen"
      class="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-xl z-30 flex flex-col"
    >
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <RouterLink
          v-for="item in menuItems"
          :key="item.text"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="[
            route.path.startsWith(item.path)
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="text-sm font-medium">{{ item.text }}</span>
        </RouterLink>
      </nav>

      <div class="px-6 py-4 border-t border-gray-200 text-sm text-gray-500">
        © 2025 Reservasi Ruangan
      </div>
    </aside>
  </transition>
</template>

<script setup>
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  Users,
  CalendarCheck
} from 'lucide-vue-next'

defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const route = useRoute()

// 🔥 "Jadwal Tetap" sudah dipindah ke BAWAH "User"
const menuItems = [
  { text: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { text: 'Reservasi', path: '/admin/reservasi', icon: CalendarDays },
  { text: 'Ruangan', path: '/admin/ruangan', icon: Building2 },
  { text: 'User', path: '/admin/user', icon: Users },
  { text: 'Jadwal Tetap', path: '/admin/jadwal-tetap', icon: CalendarCheck } // ⬅️ DI SINI
]
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
