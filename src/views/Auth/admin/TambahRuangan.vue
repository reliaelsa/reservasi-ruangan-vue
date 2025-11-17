<template>
  <div class="p-6 bg-gray-50 min-h-screen rounded-xl shadow-sm">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Tambah Ruangan</h1>

    <div class="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <form @submit.prevent="simpanRuangan" class="space-y-4">
        <!-- Nama Ruangan -->
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Nama Ruangan</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="Nama Ruangan"
          />
        </div>

        <!-- Kapasitas -->
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Kapasitas</label>
          <input
            v-model="form.capacity"
            type="number"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="(Kapasitas)"
          />
        </div>

        <!-- Keterangan -->
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Keterangan</label>
          <textarea
            v-model="form.description"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="Keterangan"
          ></textarea>
        </div>

        <!-- Status -->
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Status</label>
          <div class="flex items-center gap-6">
            <!-- Aktif -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                value="active"
                :checked="form.status === 'active'"
                @change="updateStatus('active')"
                class="appearance-none w-4 h-4 border rounded-sm checked:bg-green-500 checked:border-green-500 transition duration-200"
              />
              Aktif
            </label>

            <!-- Tidak Aktif -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                value="inactive"
                :checked="form.status === 'inactive'"
                @change="updateStatus('inactive')"
                class="appearance-none w-4 h-4 border rounded-sm checked:bg-red-500 checked:border-red-500 transition duration-200"
              />
              Tidak Aktif
            </label>
          </div>
        </div>

        <!-- Tombol -->
        <div class="flex justify-end gap-3 mt-6">
          <button
            type="submit"
            class="bg-[#007B83] text-white px-4 py-2 rounded-md hover:bg-[#00646B] transition"
          >
            Simpan
          </button>
          <button
            type="button"
            @click="batal"
            class="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  name: '',
  capacity: '',
  description: '',
  status: 'active'
})

// biar cuma satu yang bisa dipilih
const updateStatus = (selected) => {
  form.value.status = selected
}

const simpanRuangan = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(
      'http://localhost:8000/api/rooms',
      form.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('✅ Ruangan berhasil disimpan:', response.data)
    window.location.href = '/admin/ruangan'
  } catch (error) {
    console.error('❌ Gagal menyimpan ruangan:', error)
    if (error.response && error.response.data) {
      console.log('Pesan error backend:', error.response.data)
    }
  }
}

const batal = () => {
  window.location.href = '/admin/ruangan'
}
</script>
