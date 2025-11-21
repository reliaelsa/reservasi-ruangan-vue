<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

    <!-- ================= MINI CALENDAR ================ -->
    <div class="bg-white shadow rounded p-4">
      <div class="flex justify-between items-center mb-2">
        <button @click="miniPrev" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
          Prev
        </button>

        <h2 class="font-semibold text-sm">{{ miniMonth }}</h2>

        <button @click="miniNext" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
          Next
        </button>
      </div>

      <FullCalendar ref="miniRef" :options="miniCalendarOptions" />
    </div>

    <!-- ================= MAIN CALENDAR ================ -->
    <div class="md:col-span-3 bg-white shadow rounded p-4">
      <!-- NAVIGATION -->
      <div class="flex justify-between items-center mb-4">

        <h2 class="font-semibold text-lg">{{ formattedMonth }}</h2>

        <div class="flex items-center gap-2">
          <button @click="prev" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
            Prev
          </button>
          <button @click="goToday" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
            Today
          </button>
          <button @click="next" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
            Next
          </button>

          <!-- DROPDOWN -->
          <div class="relative">
            <button
              @click="toggleDropdown"
              class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              {{ modeLabel }}
            </button>

            <div
              v-if="dropdown"
              class="absolute right-0 mt-2 w-32 bg-white shadow rounded border z-50"
            >
              <button
                @click="setView('dayGridMonth')"
                class="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              >
                Bulan
              </button>
              <button
                @click="setView('timeGridWeek')"
                class="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              >
                Minggu
              </button>
              <button
                @click="setView('timeGridDay')"
                class="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              >
                Hari
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- FULLCALENDAR -->
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
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

// ======================= FORMAT BULAN =======================
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
  selectable: true,
  height: "auto",
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
      name: r.nama_ruangan,
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

    events.value = res.data.data.map((item) => {
      const tanggal = item.tanggal?.split("T")[0];

      return {
        id: item.id,
        title: `${item.room.nama_ruangan} | ${item.start_time} - ${item.end_time}`,
        start: `${tanggal}T${item.start_time}`,
        end: `${tanggal}T${item.end_time}`,
        backgroundColor:
          rooms.value.find((r) => r.id === item.room.id)?.color || "#6366F1",
        textColor: "white",
        borderColor: "transparent",
      };
    });
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
