<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Edit Jadwal Tetap</h2>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Hari</label>
        <select v-model="form.day_of_week" class="w-full p-2 border rounded">
          <option value="">Pilih Hari</option>
          <option value="Monday">Senin</option>
          <option value="Tuesday">Selasa</option>
          <option value="Wednesday">Rabu</option>
          <option value="Thursday">Kamis</option>
          <option value="Friday">Jumat</option>
          <option value="Saturday">Sabtu</option>
          <option value="Sunday">Minggu</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 font-semibold">Jam Mulai</label>
          <input type="time" v-model="form.start_time" class="w-full p-2 border rounded" />
        </div>

        <div>
          <label class="block mb-1 font-semibold">Jam Selesai</label>
          <input type="time" v-model="form.end_time" class="w-full p-2 border rounded" />
        </div>
      </div>

      <div class="mt-4">
        <label class="block mb-1 font-semibold">Ruangan</label>
        <select v-model="form.room_id" class="w-full p-2 border rounded">
          <option value="">Pilih Ruangan</option>
          <option v-for="room in rooms" :key="room.id" :value="room.id">
            {{ room.name }}
          </option>
        </select>
      </div>

      <div class="mt-4">
        <label class="block mb-1 font-semibold">Keterangan</label>
        <textarea v-model="form.description" class="w-full p-2 border rounded"></textarea>
      </div>

      <div class="flex gap-3 mt-6">
        <button @click="updateData" class="bg-teal-600 text-white px-4 py-2 rounded">
          Simpan
        </button>
        <button @click="goBack" class="bg-gray-300 px-4 py-2 rounded">
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const id = route.params.id;

const form = ref({
  day_of_week: "",
  start_time: "",
  end_time: "",
  room_id: "",
  description: "",
});

const rooms = ref([]);

// GET ROOMS
const getRooms = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:8000/api/rooms", {
    headers: { Authorization: `Bearer ${token}` },
  });
  rooms.value = res.data.data;
};

// GET DATA JADWAL
const getData = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:8000/api/fixed-schedules/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    let data = res.data.data ?? res.data ?? null;

    // Jika array, ambil data pertama
    if (Array.isArray(data)) data = data[0];

    if (!data) {
      alert("Data tidak ditemukan!");
      return;
    }

    form.value = {
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
      room_id: data.room_id,
      description: data.description,
    };
  } catch (err) {
    console.error(err);
    alert("Gagal memuat data jadwal!");
  }
};

// UPDATE DATA
const updateData = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:8000/api/fixed-schedules/${id}`,
      form.value,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Berhasil diperbarui!");
    window.location.href = "/admin/jadwal-tetap";
  } catch (err) {
    console.error(err);
    alert("Gagal memperbarui!");
  }
};

const goBack = () => {
  window.location.href = "/admin/jadwal-tetap";
};

onMounted(() => {
  getRooms();
  getData();
});
</script>
