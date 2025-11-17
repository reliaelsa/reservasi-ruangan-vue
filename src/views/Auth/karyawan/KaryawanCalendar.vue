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
      name: r.nama_ruangan, // sesuai database
      color: ["#d946ef", "#f59e0b", "#22c55e", "#2563eb"][index % 4],
    }));

    console.log("ROOMS:", rooms.value);
  } catch (error) {
    console.error("Error load rooms:", error);
  }
};

// ======================= LOAD EVENTS =======================
const loadEvents = async () => {
  try {
    const res = await axios.get("/reservations");

    console.log("🔥 RAW API RESERVATIONS:", res.data);

    events.value = res.data.data.map((item) => {
      const tanggal = item.tanggal?.split("T")[0]; // fix tanggal biar aman

      const eventData = {
        id: item.id,
        title: `${item.room.nama_ruangan} | ${item.start_time} - ${item.end_time}`,
        start: `${tanggal}T${item.start_time}`,
        end: `${tanggal}T${item.end_time}`,
        backgroundColor:
          rooms.value.find((r) => r.id === item.room.id)?.color || "#6366F1",
        textColor: "white",
        borderColor: "transparent",
      };

      console.log("🟦 EVENT GENERATED:", eventData);

      return eventData;
    });

    console.log("🟩 FINAL EVENTS:", events.value);
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
