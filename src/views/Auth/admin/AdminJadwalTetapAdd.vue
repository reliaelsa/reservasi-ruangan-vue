<template>
  <div class="p-6 bg-gray-50 min-h-screen rounded-xl shadow-sm">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Tambah Jadwal Tetap</h1>

    <div class="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <form @submit.prevent="simpanJadwal" class="space-y-6">

        <!-- Hari & Jam -->
        <div class="space-y-4">
          <label class="block font-semibold text-gray-700 mb-1">Hari & Waktu</label>

          <div class="flex items-center gap-4">

            <!-- Hari -->
            <select
              v-model="form.day_of_week"
              class="border rounded-lg px-3 py-2 w-40"
            >
              <option value="">Pilih Hari</option>
              <option value="Monday">Senin</option>
              <option value="Tuesday">Selasa</option>
              <option value="Wednesday">Rabu</option>
              <option value="Thursday">Kamis</option>
              <option value="Friday">Jumat</option>
              <option value="Saturday">Sabtu</option>
              <option value="Sunday">Minggu</option>
            </select>

            <!-- Jam Mulai -->
            <input
              type="time"
              v-model="form.start_time"
              class="border rounded-lg px-3 py-2 w-28"
            />

            <span>-</span>

            <!-- Jam Selesai -->
            <input
              type="time"
              v-model="form.end_time"
              class="border rounded-lg px-3 py-2 w-28"
            />
          </div>
        </div>

        <!-- Ruangan -->
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Ruangan</label>
          <select
            v-model="form.room_id"
            class="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Pilih Ruangan</option>
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              {{ room.name }}
            </option>
          </select>
        </div>

        <!-- Keterangan -->
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Keterangan</label>
          <textarea
            v-model="form.description"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="Keterangan tambahan (opsional)"
          ></textarea>
        </div>

        <!-- Tombol -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            class="bg-[#007B83] text-white px-5 py-2 rounded-md hover:bg-[#00646B]"
          >
            Simpan
          </button>

          <button
            type="button"
            @click="batal"
            class="border border-gray-300 px-5 py-2 rounded-md hover:bg-gray-100"
          >
            Batal
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const form = ref({
  day_of_week: '',
  start_time: '',
  end_time: '',
  room_id: '',
  description: ''
})

const rooms = ref([])

// GET ROOM LIST
const getRooms = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8000/api/rooms', {
      headers: { Authorization: `Bearer ${token}` }
    })
    rooms.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

// SIMPAN DATA
const simpanJadwal = async () => {
  if (!form.value.day_of_week || !form.value.start_time || !form.value.end_time || !form.value.room_id) {
    alert("Harap lengkapi semua field!")
    return
  }

  if (form.value.start_time >= form.value.end_time) {
    alert("Jam mulai harus lebih kecil daripada jam selesai.")
    return
  }

  try {
    const token = localStorage.getItem('token')
    await axios.post(
      'http://localhost:8000/api/fixed-schedules',
      form.value,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    alert('Jadwal berhasil ditambahkan!')
    window.location.href = '/admin/jadwal-tetap'
  } catch (err) {
    console.error(err)
    alert('Gagal menambah jadwal.')
  }
}

// BATAL
const batal = () => {
  window.location.href = '/admin/jadwal-tetap'
}

onMounted(() => {
  getRooms()
})
</script>
