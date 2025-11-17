<template>
  <div class="pt-20 p-6 bg-gray-50 min-h-screen rounded-xl shadow-sm font-sans">

    <h1 class="text-3xl font-bold text-gray-800 mb-6">Daftar User</h1>

    <div class="bg-white rounded-xl shadow overflow-y-auto" style="max-height: 600px;">
      <table class="min-w-full border-collapse text-sm">
        <thead class="bg-[#006d77] text-white sticky top-0 z-10">
          <tr>
            <th class="px-6 py-3 text-left font-semibold w-16">No</th>
            <th class="px-6 py-3 text-left font-semibold">Nama</th>
            <th class="px-6 py-3 text-left font-semibold">Email</th>
            <th class="px-6 py-3 text-left font-semibold">Role</th>
            <th class="px-6 py-3 text-center font-semibold w-40">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(user, index) in users"
            :key="user.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-6 py-3">{{ index + 1 }}</td>
            <td class="px-6 py-3 font-medium">{{ user.name }}</td>
            <td class="px-6 py-3">{{ user.email }}</td>

            <!-- ROLE FIX -->
            <td class="px-6 py-3 capitalize">
              {{ getRole(user) }}
            </td>

            <td class="px-6 py-3 flex gap-2 justify-center">

              <button
                @click="openEdit(user)"
                class="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-xs"
              >
                Edit
              </button>

              <button
                @click="deleteUser(user.id)"
                class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-xs"
              >
                Hapus
              </button>

            </td>
          </tr>

          <tr v-if="users.length === 0">
            <td colspan="5" class="text-center py-6 text-gray-500">
              Tidak ada data user.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-center text-gray-500 text-sm mt-10">
      Hak cipta © 2025 - 2030 Reservasi Ruangan | Kebijakan Privasi | Seluruh Hak Cipta
    </div>
  </div>

  <!-- POPUP -->
  <div
    v-if="showPopup"
    class="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm"
  >
    <div class="bg-white w-[400px] rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-bold mb-2">{{ popupTitle }}</h2>
      <p class="text-gray-700 mb-6">{{ popupMessage }}</p>

      <div class="flex justify-end">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          @click="showPopup = false"
        >
          {{ popupButton }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])

const showPopup = ref(false)
const popupTitle = ref('')
const popupMessage = ref('')
const popupButton = ref('Oke')

// 👉 FUNGSI AMAN UNTUK MENGAMBIL ROLE
const getRole = (user) => {
  if (!user.roles || user.roles.length === 0) return "Tidak ada role"

  // Jika roles = ["admin"]
  if (typeof user.roles[0] === "string") return user.roles[0]

  // Jika roles = [{ name: "admin" }]
  if (user.roles[0]?.name) return user.roles[0].name

  return "Tidak ada role"
}

const getUsers = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(
      'http://localhost:8000/api/admin/users?per_page=99999',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    console.log("HASIL API USERS:", response.data.data)

    users.value = response.data.data || []
  } catch (error) {
    console.error('Gagal memuat data user:', error)
  }
}

const openEdit = (user) => {
  window.location.href = `/admin/edit-user/${user.id}`
}

const deleteUser = async (id) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    popupTitle.value = 'Berhasil!'
    popupMessage.value = 'User berhasil dihapus.'
    popupButton.value = 'Oke'
    showPopup.value = true

    getUsers()
  } catch (error) {
    popupTitle.value = 'Tidak dapat dihapus!'
    popupMessage.value =
      'User ini memiliki aktifitas atau keterkaitan tertentu sehingga tidak dapat dihapus.'
    popupButton.value = 'Oke'
    showPopup.value = true
  }
}

onMounted(getUsers)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
.font-sans {
  font-family: 'Inter', sans-serif;
}
</style>
