import { createRouter, createWebHistory } from 'vue-router'

// ======================
// Halaman umum
// ======================
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import Login from '@/views/Auth/Login.vue'

// ======================
// ADMIN
// ======================
import AdminLayout from '@/views/Auth/admin/AdminLayout.vue'
import AdminDashboard from '@/views/Auth/admin/AdminDashboard.vue'
import AdminReservasi from '@/views/Auth/admin/AdminReservasi.vue'
import AdminRuangan from '@/views/Auth/admin/AdminRuangan.vue'
import AdminUser from '@/views/Auth/admin/AdminUser.vue'
import TambahRuangan from '@/views/Auth/admin/TambahRuangan.vue'
import EditRuangan from '@/views/Auth/admin/EditRuangan.vue'

import AdminJadwalTetap from '@/views/Auth/admin/AdminJadwalTetap.vue'
import AdminJadwalTetapAdd from '@/views/Auth/admin/AdminJadwalTetapAdd.vue'
import AdminJadwalTetapEdit from '@/views/Auth/admin/AdminJadwalTetapEdit.vue'
import AdminJadwalTetapHapus from '@/views/Auth/admin/AdminJadwalTetapHapus.vue'

// ======================
// KARYAWAN
// ======================
import KaryawanLayout from '@/views/Auth/karyawan/KaryawanLayout.vue'
import KaryawanDashboard from '@/views/Auth/karyawan/KaryawanDashboard.vue'
import KaryawanCalendar from '@/views/Auth/karyawan/KaryawanCalendar.vue' // ⬅ FIXED

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },

  // ======================
  // ADMIN AREA
  // ======================
  {
    path: '/admin',
    component: AdminLayout,

    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')

      if (!token || role !== 'admin') return next({ name: 'Login' })
      next()
    },

    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'reservasi', name: 'AdminReservasi', component: AdminReservasi },
      { path: 'ruangan', name: 'AdminRuangan', component: AdminRuangan },
      { path: 'tambah-ruangan', name: 'TambahRuangan', component: TambahRuangan },
      { path: 'edit-ruangan/:id', name: 'EditRuangan', component: EditRuangan, props: true },
      { path: 'user', name: 'AdminUser', component: AdminUser },

      { path: 'jadwal-tetap', name: 'AdminJadwalTetap', component: AdminJadwalTetap },
      { path: 'jadwal-tetap/add', name: 'AdminJadwalTetapAdd', component: AdminJadwalTetapAdd },
      { path: 'jadwal-tetap/edit/:id', name: 'AdminJadwalTetapEdit', component: AdminJadwalTetapEdit, props: true },
      { path: 'jadwal-tetap/hapus/:id', name: 'AdminJadwalTetapHapus', component: AdminJadwalTetapHapus, props: true },
    ],
  },

  // ======================
  // KARYAWAN AREA
  // ======================
  {
    path: '/karyawan',
    component: KaryawanLayout,

    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')

      if (!token || role !== 'karyawan') return next({ name: 'Login' })
      next()
    },

    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', name: 'KaryawanDashboard', component: KaryawanDashboard },

      // 🔥 ROUTE CALENDAR FIXED
      { path: 'calendar', name: 'KaryawanCalendar', component: KaryawanCalendar },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
