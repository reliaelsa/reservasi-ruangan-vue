<template>
  <div class="p-6 bg-[#e8eef1] min-h-screen relative">
    <!-- HEADER -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button @click="goToday" class="px-4 py-2 bg-[#2196f3] text-white rounded-xl font-semibold shadow hover:bg-[#1e88e5]">
          Sekarang
        </button>
        <button @click="prev" class="p-2 bg-white rounded-xl shadow hover:bg-gray-200">‹</button>
        <h2 class="text-2xl font-semibold text-gray-800 w-48 text-center">{{ formattedMonth }}</h2>
        <button @click="next" class="p-2 bg-white rounded-xl shadow hover:bg-gray-200">›</button>
      </div>

      <div class="flex items-center gap-3">
        <button @click="toggleSidebar" class="px-3 py-2 bg-white rounded-xl shadow border">
          {{ sidebarVisible ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar' }}
        </button>

        <div class="relative">
          <button @click="toggleDropdown" class="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow border">
            {{ modeLabel }} ▼
          </button>
          <div v-if="dropdown" class="mt-2 bg-white w-40 rounded-xl shadow absolute right-0 border z-50">
            <p class="p-2 hover:bg-gray-100 cursor-pointer" @click="setView('timeGridDay')">Hari</p>
            <p class="p-2 hover:bg-gray-100 cursor-pointer" @click="setView('timeGridWeek')">Minggu</p>
            <p class="p-2 hover:bg-gray-100 cursor-pointer" @click="setView('dayGridMonth')">Bulan</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="grid grid-cols-12 gap-6">
      <!-- SIDEBAR -->
      <div :class="sidebarVisible ? 'col-span-3 space-y-5' : 'hidden'">
        <div class="bg-white rounded-xl shadow p-4">
          <div class="flex items-center justify-between mb-2">
            <button @click="miniPrev" class="p-1 px-2 bg-gray-100 rounded hover:bg-gray-200">‹</button>
            <p class="font-semibold text-gray-700">{{ miniMonth }}</p>
            <button @click="miniNext" class="p-1 px-2 bg-gray-100 rounded hover:bg-gray-200">›</button>
          </div>
          <FullCalendar ref="miniRef" :options="miniCalendarOptions" class="mini-calendar rounded-2xl" />
        </div>

        <div class="bg-white rounded-xl shadow p-4">
          <p class="font-semibold mb-3 text-gray-700">Ruangan</p>
          <div v-for="room in rooms" :key="room.id" class="flex items-center gap-2 mb-2">
            <span class="inline-block w-3 h-3 rounded-full" :style="{ background: room.color }"></span>
            <span class="text-sm">{{ room.name }}</span>
          </div>

          <div class="mt-4 border-t pt-3">
            <p class="font-semibold mb-2 text-gray-700">Status Reservasi</p>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-full border-2 border-black bg-white"></span>
                <span class="text-sm text-gray-600">Menunggu</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-full bg-black"></span>
                <span class="text-sm text-gray-600">Disetujui</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- KALENDER -->
      <div :class="sidebarVisible ? 'col-span-9' : 'col-span-12'">
        <div class="bg-white p-6 rounded-2xl shadow relative">
          <FullCalendar ref="calendarRef" :options="calendarOptions" />
        </div>
      </div>
    </div>

    <!-- POPUP MENU KLIK TANGGAL -->
    <div
      v-if="dateMenu.open"
      ref="dateMenuRef"
      :style="{ top: dateMenu.y + 'px', left: dateMenu.x + 'px' }"
      class="absolute z-50 bg-white border rounded shadow p-3 w-44"
    >
      <p class="text-sm mb-2 font-semibold">Tanggal: {{ dateMenu.date }}</p>
      <button @click="openAddFromMenu" class="w-full text-left py-2 hover:bg-gray-100 rounded">Tambah Reservasi</button>
      <button @click="openViewFromMenu" class="w-full text-left py-2 hover:bg-gray-100 rounded">Lihat Reservasi</button>
      <button @click="closeDateMenu" class="mt-2 text-xs text-gray-500">Tutup</button>
    </div>

    <!-- MODAL: LIHAT RESERVASI -->
    <div v-if="viewModal.open" class="fixed inset-0 z-60 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeViewModal"></div>
      <div class="bg-white rounded-xl shadow-lg z-70 w-96 p-4">
        <h3 class="font-semibold mb-3">Reservasi pada {{ viewModal.date }}</h3>
        <div v-if="eventsForDate.length === 0" class="text-sm text-gray-600">Tidak ada reservasi.</div>

        <ul v-else class="space-y-2 max-h-64 overflow-auto">
          <li v-for="ev in eventsForDate" :key="ev.id" class="p-2 border rounded flex items-start gap-2">
            <div :style="{ background: ev.backgroundColor }" class="w-3 h-3 rounded-full mt-1"></div>
            <div>
              <div class="text-sm font-medium">{{ ev.title }}</div>
              <div class="text-xs text-gray-500">{{ ev.start }} {{ ev.end ? ' - ' + ev.end : '' }}</div>
            </div>
          </li>
        </ul>

        <div class="mt-4 flex justify-end">
          <button @click="closeViewModal" class="px-3 py-1 rounded bg-gray-100">Tutup</button>
        </div>
      </div>
    </div>

    <!-- MODAL: TAMBAH RESERVASI -->
    <div v-if="addReservationModal.open" class="fixed inset-0 z-60 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeAddReservationModal"></div>
      <div class="bg-white rounded-xl shadow-lg z-70 w-96 p-4">
        <h3 class="font-semibold mb-3">Tambah Reservasi</h3>
        <form @submit.prevent="submitReservation">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Nama Ruangan</label>
            <select v-model="newReservation.roomId" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
              <option v-for="room in rooms" :key="room.id" :value="room.id">{{ room.name }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Tanggal</label>
            <input type="date" v-model="newReservation.date" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Waktu Mulai</label>
            <input type="time" v-model="newReservation.startTime" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Waktu Selesai</label>
            <input type="time" v-model="newReservation.endTime" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div class="mt-4 flex justify-end">
            <button type="button" @click="closeAddReservationModal" class="px-3 py-1 rounded bg-gray-100">Batal</button>
            <button type="submit" class="ml-2 px-3 py-1 rounded bg-blue-600 text-white">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "@/utils/axios";
import { format } from "date-fns";
import id from "date-fns/locale/id";

const router = useRouter();

const dropdown = ref(false);
const mode = ref("dayGridMonth");
const events = ref([]);
const rooms = ref([]);
const addReservationModal = ref({ open: false });
const newReservation = ref({ roomId: null, date: '', startTime: '', endTime: '' });

const calendarRef = ref(null);
const miniRef = ref(null);

const currentDate = ref(new Date());
const miniDate = ref(new Date());
const sidebarVisible = ref(true);

const dateMenu = ref({ open: false, x: 0, y: 0, date: null });
const viewModal = ref({ open: false, date: null });

const toggleSidebar = () => (sidebarVisible.value = !sidebarVisible.value);
const toggleDropdown = () => (dropdown.value = !dropdown.value);

const formattedMonth = computed(() => format(currentDate.value, "MMMM yyyy", { locale: id }));
const miniMonth = computed(() => format(miniDate.value, "MMMM yyyy", { locale: id }));
const modeLabel = computed(() =>
  mode.value === "dayGridMonth" ? "Bulan" : mode.value === "timeGridWeek" ? "Minggu" : "Hari"
);

const prev = () => calendarRef.value.getApi().prev();
const next = () => calendarRef.value.getApi().next();
const goToday = () => calendarRef.value.getApi().today();
const setView = (v) => {
  mode.value = v;
  dropdown.value = false;
  calendarRef.value.getApi().changeView(v);
};

const miniPrev = () => miniRef.value.getApi().prev();
const miniNext = () => miniRef.value.getApi().next();

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  height: 700,
  headerToolbar: false,
  events: [],

  dateClick(info) {
    openDateMenu(info);
  },

  eventClick(info) {
    const ev = info.event;
    viewModal.value.date = format(ev.start, "yyyy-MM-dd");
    viewModal.value.open = true;
  },

  datesSet(info) {
    currentDate.value = info.view.currentStart;
  },

  eventContent(arg) {
    const props = arg.event.extendedProps;
    const color = arg.event.backgroundColor || "#6366F1";
    const status = props.status || props.status_reservation || "approved";

    const statusDot =
      status === "pending" || status === "menunggu"
        ? `<span style="width:10px;height:10px;border-radius:50%;border:2px solid black;background:white;display:inline-block;margin-right:4px;"></span>`
        : `<span style="width:10px;height:10px;border-radius:50%;background:black;display:inline-block;margin-right:4px;"></span>`;

    return {
      html: `
        <div style="
          display:flex;
          align-items:center;
          gap:6px;
          padding:3px 8px;
          background:${color}20;
          border-radius:20px;
          font-size:12px;
          font-weight:500;
          overflow:hidden;
          white-space:nowrap;
        ">
          <span style="width:10px;height:10px;background:${color};border-radius:50%;flex-shrink:0;"></span>
          ${statusDot}
          <span>${arg.event.title}</span>
        </div>
      `,
    };
  },
});

const miniCalendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  headerToolbar: false,
  height: "auto",
  selectable: true,
  dateClick(info) {
    calendarRef.value.getApi().gotoDate(info.date);
  },
  datesSet(info) {
    miniDate.value = info.view.currentStart;
  },
});

const loadRooms = async () => {
  try {
    const res = await axios.get("/rooms");
    const data = res.data?.data ?? res.data ?? [];
    rooms.value = data.map((r, i) => ({
      id: r.id,
      name: r.nama ?? r.name ?? `Ruangan ${r.id}`,
      color: ["#d946ef", "#f59e0b", "#22c55e", "#2563eb", "#00b894"][i % 5],
    }));
  } catch (err) {
    console.error("rooms", err);
  }
};

const loadEvents = async () => {
  try {
    const res = await axios.get("/reservations");
    const items = res.data?.data ?? res.data ?? [];

    const prepared = items.map((item) => {
      const tanggalRaw = item.tanggal ?? item.date ?? null;
      const waktuMulai = item.waktu_mulai ?? item.start_time ?? null;
      const waktuSelesai = item.waktu_selesai ?? item.end_time ?? null;

      let dateOnly = tanggalRaw?.split("T")[0] ?? tanggalRaw;

      let start = `${dateOnly}T${waktuMulai}`;
      let end = `${dateOnly}T${waktuSelesai}`;

      const roomObj = item.room ?? item.ruangan ?? {};
      const roomColor =
        rooms.value.find((r) => r.id === roomObj.id)?.color || "#6366F1";

      const titleRoom = roomObj.name ?? roomObj.nama ?? "Ruangan";

      const status = item.status ?? "approved";

      return {
        id: item.id,
        title: `${titleRoom} | ${waktuMulai} - ${waktuSelesai}`,
        start,
        end,
        backgroundColor: roomColor,
        status: status,
      };
    });

    events.value = prepared;
    calendarRef.value.getApi().removeAllEvents();
    prepared.forEach((e) => calendarRef.value.getApi().addEvent(e));
  } catch (err) {
    console.error("events", err);
  }
};

function openDateMenu(info) {
  dateMenu.value = {
    open: true,
    x: info.jsEvent.clientX,
    y: info.jsEvent.clientY,
    date: info.dateStr,
  };
}

function closeDateMenu() {
  dateMenu.value.open = false;
}

function openAddFromMenu() {
  closeDateMenu();
  addReservationModal.value.open = true;
}

function closeAddReservationModal() {
  addReservationModal.value.open = false;
  newReservation.value = { roomId: null, date: "", startTime: "", endTime: "" };
}

async function submitReservation() {
  try {
    await axios.post("/reservations", {
      roomId: newReservation.value.roomId,
      date: newReservation.value.date,
      startTime: newReservation.value.startTime,
      endTime: newReservation.value.endTime,
    });
    closeAddReservationModal();
    await loadEvents();
  } catch (error) {
    console.error("Error adding reservation:", error);
  }
}

function openViewFromMenu() {
  viewModal.value.date = dateMenu.value.date;
  viewModal.value.open = true;
  closeDateMenu();
}

function closeViewModal() {
  viewModal.value.open = false;
}

const eventsForDate = computed(() => {
  const d = viewModal.value.date;
  if (!d) return [];
  return events.value.filter((ev) => (ev.start || "").split("T")[0] === d);
});

onMounted(async () => {
  await loadRooms();
  await loadEvents();
});
</script>

<style scoped>
/* small local styles */
</style>
