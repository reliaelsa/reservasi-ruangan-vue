<template>
  <!-- OVERLAY BURAM CERAH -->
  <div class="fixed inset-0 bg-gray-90 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">

    <!-- CARD POPUP -->
    <div class="bg-white rounded-xl shadow-lg px-6 py-5 w-full max-w-sm border border-gray-200">

      <p class="text-gray-800 text-base mb-5 text-center">
        Jadwal Tetap tersebut telah berhasil dihapus.
      </p>

      <!-- BUTTON DI KANAN -->
      <div class="flex justify-end">
        <button
          @click="kembali"
          class="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition text-sm"
        >
          Oke
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { onMounted } from "vue"
import axios from "axios"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

// HAPUS DATA SAAT HALAMAN DIBUKA
onMounted(async () => {
  try {
    const token = localStorage.getItem("token")

    await axios.delete(
      `http://localhost:8000/api/fixed-schedules/${route.params.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

  } catch (error) {
    console.error("Gagal menghapus jadwal:", error)
  }
})

const kembali = () => {
  router.push("/admin/jadwal-tetap")
}
</script>

<style scoped>
</style>
