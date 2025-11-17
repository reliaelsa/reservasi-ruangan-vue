<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans bg-gray-50 min-h-screen rounded-xl shadow-sm mt-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Dashboard Admin</h1>

    <div v-if="loading" class="text-gray-500">Memuat data...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else>
      <!-- Ringkasan -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#00b894] hover:scale-[1.02] transition">
          <h3 class="text-sm text-gray-500">Total Reservasi</h3>
          <p class="text-3xl font-bold text-gray-800">{{ stats.total.reservations }}</p>
          <p class="text-xs text-gray-500 mt-1">
            Perubahan:
            <span :class="stats.change.reservations >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ stats.change.reservations }}%
            </span>
          </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#0984e3] hover:scale-[1.02] transition">
          <h3 class="text-sm text-gray-500">Total Ruangan</h3>
          <p class="text-3xl font-bold text-gray-800">{{ stats.total.rooms }}</p>
          <p class="text-xs text-gray-500 mt-1">
            Perubahan:
            <span :class="stats.change.rooms >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ stats.change.rooms }}%
            </span>
          </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#6c5ce7] hover:scale-[1.02] transition">
          <h3 class="text-sm text-gray-500">Jadwal Tetap</h3>
          <p class="text-3xl font-bold text-gray-800">{{ stats.total.fixedSchedules }}</p>
          <p class="text-xs text-gray-500 mt-1">
            Perubahan:
            <span :class="stats.change.fixedSchedules >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ stats.change.fixedSchedules }}%
            </span>
          </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#d63031] hover:scale-[1.02] transition">
          <h3 class="text-sm text-gray-500">Total Pengguna</h3>
          <p class="text-3xl font-bold text-gray-800">{{ stats.total.users }}</p>
          <p class="text-xs text-gray-500 mt-1">
            Perubahan:
            <span :class="stats.change.users >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ stats.change.users }}%
            </span>
          </p>
        </div>
      </div>

      <!-- Chart -->
      <div class="bg-white shadow-md p-6 rounded-xl">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler // ✅ Tambahkan Filler
} from 'chart.js'

// Register semua komponen + Filler
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler)

const router = useRouter()
const stats = ref({
  total: { reservations: 0, rooms: 0, fixedSchedules: 0, users: 0 },
  change: { reservations: 0, rooms: 0, fixedSchedules: 0, users: 0 },
  currentMonth: '',
})

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Reservasi Bulanan',
      data: [],
      borderColor: '#00b894',
      backgroundColor: 'rgba(0, 184, 148, 0.2)',
      tension: 0.3,
      fill: true // ✅ Sekarang aman karena Filler sudah di-register
    }
  ]
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'bottom'
    },
    title: {
      display: true,
      text: 'Statistik Reservasi Bulanan'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 }
    }
  }
}

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/login')
    return
  }

  try {
    const response = await axios.get('http://127.0.0.1:8000/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = response.data
    stats.value = data
    chartData.value.labels = data.chart.labels
    chartData.value.datasets[0].data = data.chart.data
  } catch (err) {
    console.error('❌ Error Dashboard:', err)

    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('name')
      router.push('/login')
    } else {
      error.value = 'Gagal memuat data dashboard.'
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
.font-sans {
  font-family: 'Inter', sans-serif;
}
</style>
