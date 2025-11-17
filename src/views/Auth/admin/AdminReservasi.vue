<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Daftar Reservasi</h1>

    <div class="flex gap-4 mb-6">
      <select v-model="selectedRoom" class="border p-2 rounded">
        <option value="">Semua Ruangan</option>
        <option v-for="room in rooms" :key="room" :value="room">
          {{ room }}
        </option>
      </select>

      <select v-model="selectedStatus" class="border p-2 rounded">
        <option value="">Semua Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="canceled">Canceled</option>
      </select>

      <input type="date" v-model="selectedDate" class="border p-2 rounded" />

      <button
        @click="exportLaporan"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Export Laporan
      </button>
    </div>

    <div class="overflow-x-auto bg-white shadow rounded-lg">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 text-gray-700 text-left">
            <th class="p-3 border-b">Nama User</th>
            <th class="p-3 border-b">Ruangan</th>
            <th class="p-3 border-b">Tanggal</th>
            <th class="p-3 border-b">Jam</th>
            <th class="p-3 border-b text-center">Status</th>
            <th class="p-3 border-b text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredReservations"
            :key="item.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="p-3">{{ item.user.name }}</td>
            <td class="p-3">{{ item.room.nama_ruangan }}</td>
            <td class="p-3">{{ item.tanggal }}</td>
            <td class="p-3">{{ item.start_time }} - {{ item.end_time }}</td>

            <td class="p-3 capitalize text-center">
              <span
                :class="{
                  'text-yellow-600 font-medium': item.status === 'pending',
                  'text-green-600 font-medium': item.status === 'approved',
                  'text-red-600 font-medium': item.status === 'rejected',
                  'text-gray-500 font-medium': item.status === 'canceled',
                }"
              >
                {{
                  item.status === 'approved' ? 'Disetujui' :
                  item.status === 'rejected' ? 'Ditolak' :
                  item.status === 'canceled' ? 'Dibatalkan' :
                  'Menunggu'
                }}
              </span>
            </td>

            <td class="p-3 flex justify-center gap-2 relative">
              <template v-if="item.status === 'pending'">
                <button
                  @click="openConfirmDialog(item, 'approved')"
                  class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Setujui
                </button>
                <button
                  @click="openConfirmDialog(item, 'rejected')"
                  class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Tolak
                </button>
              </template>

              <template v-else>
                <select
                  @change="handleStatusChange($event.target.value, item, $event)"
                  class="p-1 border border-gray-400 rounded cursor-pointer appearance-none bg-gray-200 text-gray-700 shadow text-sm font-medium"
                >
                  <option value="" disabled selected>Ubah Status</option>
                  <option
                    v-for="status in ['approved', 'rejected', 'canceled', 'pending']"
                    :key="status"
                    :value="status"
                    :disabled="item.status === status"
                  >
                    {{
                      status === 'approved' ? 'Disetujui' :
                      status === 'rejected' ? 'Ditolak' :
                      status === 'canceled' ? 'Dibatalkan' :
                      'Menunggu'
                    }}
                  </option>
                </select>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pop-up konfirmasi -->
    <div
      v-if="showConfirmDialog"
      class="fixed inset-0 bg-gray-90 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="closeConfirmDialog"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">
          Apakah Anda yakin ingin {{
            confirmAction === 'approved' ? 'menyetujui' :
            confirmAction === 'rejected' ? 'menolak' :
            'membatalkan'
          }} reservasi ini?
        </h2>
        <p class="text-gray-600 mb-6">
          Alasan {{
            confirmAction === 'approved' ? 'menyetujui' :
            confirmAction === 'rejected' ? 'menolak' :
            'membatalkan'
          }}?
        </p>
        <textarea
          v-model="alasan"
          class="w-full border border-gray-300 rounded p-2 mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan alasan..."
        ></textarea>
        <div class="flex gap-3 justify-end">
          <button
            @click="confirmSubmit"
            class="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 font-medium"
          >
            Kirim
          </button>
          <button
            @click="closeConfirmDialog"
            class="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const rooms = ref([])
const selectedRoom = ref('')
const selectedStatus = ref('')
const selectedDate = ref('')
const reservations = ref([])
const showConfirmDialog = ref(false)
const confirmAction = ref('')
const selectedItem = ref(null)
const alasan = ref('')

const API_BASE = 'http://localhost:8000/api/admin'

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8000/api/reservations', {
      headers: { Authorization: `Bearer ${token}` }
    })
    reservations.value = res.data.data
    rooms.value = [...new Set(reservations.value.map(r => r.room.nama_ruangan))]
  } catch (error) {
    console.error('Gagal memuat data reservasi:', error)
  }
})

const filteredReservations = computed(() => {
  return reservations.value.filter(r => {
    const byRoom = selectedRoom.value ? r.room.nama_ruangan === selectedRoom.value : true
    const byStatus = selectedStatus.value ? r.status === selectedStatus.value : true
    const byDate = selectedDate.value ? r.tanggal === selectedDate.value : true
    return byRoom && byStatus && byDate
  })
})

const handleStatusChange = (newStatus, item, event) => {
  if (event) event.target.value = ''
  if (['approved', 'rejected', 'canceled'].includes(newStatus)) {
    openConfirmDialog(item, newStatus)
  } else if (newStatus === 'pending') {
    updateReservationStatus(item, newStatus)
  }
}

const openConfirmDialog = (item, action) => {
  selectedItem.value = item
  confirmAction.value = action
  alasan.value = ''
  showConfirmDialog.value = true
}

const closeConfirmDialog = () => {
  showConfirmDialog.value = false
  selectedItem.value = null
  confirmAction.value = ''
  alasan.value = ''
}

const confirmSubmit = async () => {
  if (!selectedItem.value) return
  await updateReservationStatus(selectedItem.value, confirmAction.value, alasan.value)
  closeConfirmDialog()
}

const updateReservationStatus = async (item, action, reason = '') => {
  try {
    if (['rejected', 'canceled'].includes(action) && !reason.trim()) return

    const token = localStorage.getItem('token')
    const url = `${API_BASE}/reservations/${item.id}/status/${action}`
    const payload = reason.trim() ? { alasan: reason } : {}

    await axios.put(url, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    item.status = action
  } catch (error) {
    console.error(`Gagal mengubah status menjadi ${action}:`, error)
  }
}

const exportLaporan = () => {
  console.log('Export laporan berhasil (simulasi)')
}
</script>
