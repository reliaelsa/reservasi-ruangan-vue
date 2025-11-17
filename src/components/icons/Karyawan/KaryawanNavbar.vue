<template>
  <header
    class="bg-white shadow px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-20"
  >
    <div class="flex items-center gap-3">
      <button @click="$emit('toggle-sidebar')" class="text-gray-700 text-2xl">
        ☰
      </button>
      <img src="@/assets/logo2.jpg" class="h-10" />
      <h1 class="font-semibold text-gray-800">Menu Karyawan</h1>
    </div>

    <button @click="logout" class="text-red-500 font-medium hover:underline">
      Logout
    </button>
  </header>
</template>

<script setup>
const logout = () => {
  localStorage.clear()
  window.location.href = "/login"
}
</script>
