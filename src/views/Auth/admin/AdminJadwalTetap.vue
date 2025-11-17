<template>
  <div class="pt-20 px-8">

    <h1 class="text-3xl font-bold mb-6">Jadwal Tetap</h1>

    <!-- BUTTON TAMBAH -->
    <button
      @click="goToAdd"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-6 hover:bg-blue-700 transition"
    >
      <span>➕</span> Tambah
    </button>

    <!-- LIST JADWAL -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="jadwal in schedules"
        :key="jadwal.id"
        class="border rounded-xl p-4 shadow-sm"
      >
        <h2 class="text-xl font-semibold mb-2">
          {{ jadwal.room?.name || "Ruangan Tidak Ada" }}
        </h2>

        <p><strong>Hari:</strong> {{ convertDay(jadwal.day_of_week) }}</p>

        <p class="mt-1">
          <strong>Waktu:</strong>
          {{ formatTime(jadwal.start_time) }} - {{ formatTime(jadwal.end_time) }}
        </p>

        <p class="mt-1">
          <strong>Keterangan:</strong> {{ jadwal.description }}
        </p>

        <div class="flex gap-3 mt-4">
          <button
            @click="goToEdit(jadwal.id)"
            class="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600"
          >
            Edit
          </button>

          <button
            @click="goToDelete(jadwal.id)"
            class="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>

    <div v-if="schedules.length === 0" class="text-gray-500 mt-8">
      Tidak ada jadwal tetap.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

// DATA
const schedules = ref([])

// AMBIL DATA API
const getSchedules = async () => {
  try {
    const token = localStorage.getItem("token")
    const res = await axios.get("http://localhost:8000/api/fixed-schedules", {
      headers: { Authorization: `Bearer ${token}` }
    })

    schedules.value = res.data.data || []
    console.log("DATA FIXED SCHEDULE:", schedules.value)

  } catch (e) {
    console.error("Gagal memuat jadwal tetap:", e)
  }
}

// FORMAT HARI
const convertDay = (day) => {
  const map = {
    Monday: "Senin",
    Tuesday: "Selasa",
    Wednesday: "Rabu",
    Thursday: "Kamis",
    Friday: "Jumat",
    Saturday: "Sabtu",
    Sunday: "Minggu",
  }
  return map[day] || day
}

// FORMAT WAKTU
const formatTime = (time) => {
  return time.substring(0, 5)
}

// ARAHKAN KE FORM TAMBAH
const goToAdd = () => {
  window.location.href = "/admin/jadwal-tetap/add"
}

// ARAHKAN KE FORM EDIT
const goToEdit = (id) => {
  window.location.href = `/admin/jadwal-tetap/edit/${id}`
}

// ARAHKAN KE HALAMAN KONFIRMASI HAPUS
const goToDelete = (id) => {
  window.location.href = `/admin/jadwal-tetap/hapus/${id}`
}

onMounted(getSchedules)
</script>

<style scoped>
</style>
