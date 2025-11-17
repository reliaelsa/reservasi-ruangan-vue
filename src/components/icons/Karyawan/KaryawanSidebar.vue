<template>
  <aside
    :class="[
      'bg-white shadow fixed top-0 left-0 h-full w-64 z-30 transition-transform duration-300',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="p-6 font-bold text-gray-700 text-lg border-b">
      Menu Karyawan
    </div>

    <nav class="p-4 space-y-3 text-gray-700">
      <RouterLink
        to="/karyawan/dashboard"
        class="block px-4 py-2 rounded hover:bg-gray-100"
      >
        Dashboard
      </RouterLink>

      <!-- 🔥 SANGAT PENTING: path diperbaiki dari 'calender' → 'calendar' -->
      <RouterLink
        to="/karyawan/calendar"
        class="block px-4 py-2 rounded hover:bg-gray-100"
      >
        Kalender Reservasi
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  isOpen: Boolean
})
</script>
