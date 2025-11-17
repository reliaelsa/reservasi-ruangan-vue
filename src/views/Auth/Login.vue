<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans relative">
    <div class="w-[1000px] h-[550px] bg-white rounded-[30px] shadow-2xl border border-gray-100 flex p-8 relative z-10">

      <!-- Kiri: Form Login -->
      <div class="w-[580px] flex items-center justify-center relative z-20">
        <div class="w-full px-12 pointer-events-auto">
          <h2 class="text-3xl font-bold text-gray-900 mb-2 text-center">Login</h2>
          <p class="text-sm text-gray-500 mb-10 text-center">Masuk untuk memesan ruang pertemuan</p>

          <div v-if="state.error" class="text-sm text-red-600 mb-3 p-2 bg-red-50 border border-red-200 rounded-lg transition">
            {{ state.error }}
          </div>

          <form @submit.prevent="submit">
            <div class="mb-4">
              <label class="text-sm text-gray-700 font-medium block mb-1">Email</label>
              <input
                v-model="state.email"
                type="email"
                placeholder="Masukkan email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-base focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
              />
            </div>

            <div class="mb-6">
              <div class="flex items-center justify-between mb-1">
                <label class="text-sm text-gray-700 font-medium">Password</label>
                <a href="#" class="text-xs text-blue-600 hover:underline transition">Lupa password?</a>
              </div>
              <input
                v-model="state.password"
                type="password"
                placeholder="Masukkan password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-base focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-[#006a74] text-white py-2.5 rounded-lg font-semibold text-base hover:bg-[#00565d] transition-all shadow-md"
            >
              Login
            </button>
          </form>

          <div class="mt-4 flex gap-3">
            <button
              type="button"
              @click="() => state.error = 'Login Google belum tersedia.'"
              class="flex-1 py-1.5 border border-gray-300 rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition shadow-sm text-gray-700 font-medium"
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" class="w-3.5 h-3.5" alt="Google" />
              Login dengan Google
            </button>
            <button
              type="button"
              @click="() => state.error = 'Login Apple belum tersedia.'"
              class="flex-1 py-1.5 border border-gray-300 rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition shadow-sm text-gray-700 font-medium"
            >
              <img src="../../assets/apel.png" class="w-6 h-6" alt="Apple" />
              Login dengan Apple
            </button>
          </div>
        </div>
      </div>

      <!-- Kanan: Gambar -->
      <div class="flex-1 flex justify-center items-center h-full pointer-events-none">
        <div class="w-full h-full bg-white rounded-xl overflow-hidden shadow-lg">
          <img src="../../assets/ruang-rapat.jpg" alt="Meeting Room" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter()

    const state = reactive({
      email: '',
      password: '',
      error: ''
    })

    async function submit() {
      state.error = ''
      console.log('✅ Tombol login diklik!')

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
          email: state.email,
          password: state.password
        })

        const data = response.data.data || {}
        const user = data.user || {}
        const token = data.token || ''

        // Simpan data user ke localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('name', user.name || 'Pengguna')
        localStorage.setItem('role', user.role || 'admin')

        console.log('Token:', token)
        console.log('Role:', user.role)
        console.log('Name:', user.name)

        // Arahkan sesuai role
        const role = user.role || 'admin'
        if (role === 'admin') {
          router.push('/admin/dashboard')
        } else if (role === 'karyawan') {
          router.push('/karyawan/dashboard')
        } else {
          router.push('/admin/dashboard')
        }

      } catch (error) {
        console.error('❌ Error login:', error)
        if (error.response && error.response.data && error.response.data.message) {
          state.error = error.response.data.message
        } else {
          state.error = 'Email atau password salah. Coba lagi!'
        }
      }
    }

    return { state, submit }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
.font-sans {
  font-family: 'Inter', sans-serif;
}
</style>
