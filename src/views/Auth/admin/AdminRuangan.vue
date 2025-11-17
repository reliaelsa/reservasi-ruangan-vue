<template>
  <!-- Wrapper halaman dengan padding-top sesuai tinggi navbar -->
  <div class="pt-20 p-6 bg-gray-50 min-h-screen rounded-xl shadow-sm font-sans">
    <!-- Judul Halaman -->
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Data Ruangan</h1>

    <!-- Tombol Tambah -->
    <div class="mb-6">
      <button
        @click="tambahRuangan"
        class="bg-[#00b894] text-white px-4 py-2 rounded-lg hover:bg-[#019874] transition flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Tambah
      </button>
    </div>

    <!-- Tabel Data Ruangan -->
    <div class="bg-white rounded-xl shadow overflow-y-auto" style="max-height: 600px;">
      <table class="min-w-full border-collapse text-sm">
        <thead class="bg-[#006d77] text-white sticky top-0 z-10">
          <tr>
            <th class="px-6 py-3 text-left font-semibold w-16">No</th>
            <th class="px-6 py-3 text-left font-semibold">Nama</th>
            <th class="px-6 py-3 text-left font-semibold">Kapasitas</th>
            <th class="px-6 py-3 text-left font-semibold">Deskripsi</th>
            <th class="px-6 py-3 text-left font-semibold w-24">Status</th>
            <th class="px-6 py-3 text-center font-semibold w-40">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(room, index) in rooms" :key="room.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-3">{{ index + 1 }}</td>
            <td class="px-6 py-3 font-medium">{{ room.name }}</td>
            <td class="px-6 py-3">{{ room.capacity }}</td>
            <td class="px-6 py-3">{{ room.description }}</td>
            <td class="px-6 py-3">
              <span
                :class="{
                  'text-green-600 font-semibold': room.status === 'active' || room.status === 'Aktif',
                  'text-red-600 font-semibold': room.status === 'inactive' || room.status === 'Tidak Aktif'
                }"
              >
                {{ room.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </td>
            <td class="px-6 py-3 text-center space-x-2">
              <button
                @click="editRuangan(room)"
                class="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-xs"
              >
                Edit
              </button>
              <button
                @click="hapusRuangan(room)"
                class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-xs"
              >
                Hapus
              </button>
            </td>
          </tr>

          <tr v-if="rooms.length === 0">
            <td colspan="6" class="text-center py-6 text-gray-500">
              Tidak ada data ruangan.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="text-center text-gray-500 text-sm mt-10">
      Hak cipta © 2025 - 2030 Reservasi Ruangan | Kebijakan Privasi | Seluruh Hak Cipta
    </div>
  </div>

  <!-- Popup Alert Tidak Bisa Hapus (DESAIN MIRIP FOTO + BLUR KUAT) -->
<div
  v-if="showPopup"
class="fixed inset-0 bg-gray-90 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
  <div class="bg-[#f2f4f5] w-[480px] rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-semibold text-gray-800 mb-2">
      Tidak dapat di hapus!
    </h2>

    <p class="text-gray-600 mb-6">
      Ruangan ini sedang aktif atau sudah dibooking, sehingga tidak dapat dihapus.
    </p>

    <div class="flex justify-end">
      <button
        @click="showPopup = false"
        class="bg-[#006d77] text-white px-6 py-2 rounded-md hover:bg-[#005c68] transition"
      >
        Oke
      </button>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const rooms = ref([])
const showPopup = ref(false)

// Ambil data ruangan dari API
const fetchRooms = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:8000/api/rooms', {
      headers: { Authorization: `Bearer ${token}` }
    })
    rooms.value = response.data.data || []
  } catch (error) {
    console.error('Gagal memuat data ruangan:', error)
  }
}

onMounted(fetchRooms)

// Navigasi
const tambahRuangan = () => {
  window.location.href = '/admin/tambah-ruangan'
}

const editRuangan = (room) => {
  window.location.href = `/admin/edit-ruangan/${room.id}`
}

// Hapus ruangan dengan pengecekan status
const hapusRuangan = async (room) => {
  if (room.status === 'active' || room.status === 'Aktif') {
    showPopup.value = true
    return
  }

  if (confirm('Yakin ingin menghapus ruangan ini?')) {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:8000/api/rooms/${room.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      rooms.value = rooms.value.filter(r => r.id !== room.id)
      alert('Ruangan berhasil dihapus!')
    } catch (error) {
      console.error('Gagal menghapus ruangan:', error)
      alert('Terjadi kesalahan saat menghapus ruangan.')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
.font-sans {
  font-family: 'Inter', sans-serif;
}
</style>
