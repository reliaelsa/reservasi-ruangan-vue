<template>
  <!-- CSS FullCalendar -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@5.11.5/main.min.css"
  />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@fullcalendar/timegrid@5.11.5/main.min.css"
  />

  <div class="p-6 bg-[#e8eef1] min-h-screen">
    <!-- HEADER -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button
          @click="goToday"
          class="px-4 py-2 bg-[#2196f3] text-white rounded-xl font-semibold shadow hover:bg-[#1e88e5]"
        >
          Sekarang
        </button>

        <button @click="prev" class="p-2 bg-white rounded-xl shadow hover:bg-gray-200">‹</button>

        <h2 class="text-2xl font-semibold text-gray-800 w-48 text-center">
          {{ formattedMonth }}
        </h2>

        <button @click="next" class="p-2 bg-white rounded-xl shadow hover:bg-gray-200">›</button>
      </div>

      <!-- DROPDOWN -->
      <div class="relative">
        <button
          @click="toggleDropdown"
          class="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow border"
        >
          {{ modeLabel }} ▼
        </button>

        <div
          v-if="dropdown"
          class="mt-2 bg-white w-40 rounded-xl shadow absolute right-10 border z-50"
        >
          <p class="p-2 hover:bg-gray-100 cursor-pointer" @click="setView('timeGridDay')">Hari</p>
          <p class="p-2 hover:bg-gray-100 cursor-pointer" @click="setView('timeGridWeek')">Minggu</p>
          <p class="p-2 hover:bg-gray-100 cursor-pointer" @click="setView('dayGridMonth')">Bulan</p>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="grid grid-cols-12 gap-6">
      <!-- SIDEBAR -->
      <div class="col-span-3 space-y-5">
        <div class="bg-white rounded-xl shadow p-4">
          <div class="flex items-center justify-between mb-2">
            <button @click="miniPrev" class="p-1 px-2 bg-gray-100 rounded hover:bg-gray-200">‹</button>

            <p class="font-semibold text-gray-700">
              {{ miniMonth }}
            </p>

            <button @click="miniNext" class="p-1 px-2 bg-gray-100 rounded hover:bg-gray-200">›</button>
          </div>

          <FullCalendar
            ref="miniRef"
            :options="miniCalendarOptions"
            class="mini-calendar rounded-2xl"
          />
        </div>

        <!-- LEGEND RUANGAN -->
        <div class="bg-white rounded-xl shadow p-4">
          <p class="font-semibold mb-3 text-gray-700">Ruangan</p>

          <div v-for="room in rooms" :key="room.id" class="flex items-center gap-2 mb-2">
            <span
              class="inline-block w-3 h-3 rounded-full"
              :style="{ background: room.color }"
            ></span>
            <span class="text-sm">{{ room.name }}</span>
          </div>
        </div>
      </div>

      <!-- KALENDER BESAR -->
      <div class="col-span-9">
        <div class="bg-white p-6 rounded-2xl shadow">
          <FullCalendar ref="calendarRef" :options="calendarOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import axios from "@/utils/axios";
import { format } from "date-fns";
import id from "date-fns/locale/id";

// ======================= STATE =======================
const dropdown = ref(false);
const mode = ref("dayGridMonth");
const events = ref([]);

const rooms = ref([]);

const calendarRef = ref(null);
const miniRef = ref(null);

const currentDate = ref(new Date());
const miniDate = ref(new Date());

// ======================= BULAN =======================
const formattedMonth = computed(() =>
  format(currentDate.value, "MMMM yyyy", { locale: id })
);

const miniMonth = computed(() =>
  format(miniDate.value, "MMMM yyyy", { locale: id })
);

// ======================= DROPDOWN =======================
const toggleDropdown = () => (dropdown.value = !dropdown.value);
const modeLabel = computed(() => {
  if (mode.value === "dayGridMonth") return "Bulan";
  if (mode.value === "timeGridWeek") return "Minggu";
  return "Hari";
});

// ======================= CALENDAR MAIN =======================
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  height: 700,
  headerToolbar: false,
  events,

  datesSet(info) {
    currentDate.value = info.view.currentStart;
  },
});

// ======================= MINI CALENDAR =======================
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

// ======================= NAVIGATION =======================
const miniPrev = () => miniRef.value.getApi().prev();
const miniNext = () => miniRef.value.getApi().next();

const prev = () => calendarRef.value.getApi().prev();
const next = () => calendarRef.value.getApi().next();
const goToday = () => calendarRef.value.getApi().today();

const setView = (v) => {
  mode.value = v;
  dropdown.value = false;
  calendarRef.value.getApi().changeView(v);
};

// ======================= LOAD ROOMS =======================
const loadRooms = async () => {
  try {
    const res = await axios.get("/rooms");

    rooms.value = res.data.data.map((r, index) => ({
      id: r.id,
      name: r.nama,
      color: ["#d946ef", "#f59e0b", "#22c55e", "#2563eb"][index % 4],
    }));
  } catch (error) {
    console.error("Error load rooms:", error);
  }
};

// ======================= LOAD EVENTS =======================
const loadEvents = async () => {
  try {
    const res = await axios.get("/reservations");

    events.value = res.data.data.map((item) => ({
      id: item.id,
      title: `${item.room.nama} | ${item.time_start} - ${item.time_end}`,
      start: `${item.date}T${item.time_start}`,
      end: `${item.date}T${item.time_end}`,
      backgroundColor: rooms.value.find((r) => r.id === item.room.id)?.color,
      textColor: "white",
      borderColor: "transparent",
    }));
  } catch (error) {
    console.error("Error load events:", error);
  }
};

// ======================= ON MOUNT =======================
onMounted(async () => {
  await loadRooms();
  await loadEvents();
});
</script>

<style>
.mini-calendar .fc {
  font-size: 12px !important;
}

.mini-calendar .fc-daygrid-day-frame {
  padding: 2px !important;
}

.mini-calendar .fc-daygrid-day {
  height: 24px !important;
}

.mini-calendar .fc-daygrid-day-number {
  font-size: 11px !important;
}

.mini-calendar .fc-daygrid-day-events {
  display: none !important;
}
</style>
