<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ref, watch } from "vue";

// Form refs
const eventName = ref("");
const selectedDates = ref([]); // Will still store the calculated dates
const selectedWeekday = ref(""); // 0-6 for Sunday-Saturday
const extendedMonths = ref(1); // Default to 1 month
const responsibleUser = ref("");
const selectedUsers = ref([]);
const selectedArea = ref("");

// Sample data for dropdowns
const users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alex Johnson" },
  { id: 4, name: "Sara Williams" },
];

const areas = [
  { id: 1, name: "Marketing" },
  { id: 2, name: "Development" },
  { id: 3, name: "HR" },
  { id: 4, name: "Finance" },
];

// Weekdays for the dropdown
const weekdays = [
  { value: 0, name: "Sunday" },
  { value: 1, name: "Monday" },
  { value: 2, name: "Tuesday" },
  { value: 3, name: "Wednesday" },
  { value: 4, name: "Thursday" },
  { value: 5, name: "Friday" },
  { value: 6, name: "Saturday" },
];

// Calculate dates based on selected weekday and number of months
const calculateDates = () => {
  if (selectedWeekday.value === "") return;

  const today = new Date();
  const dayOfWeek = parseInt(selectedWeekday.value);
  const months = parseInt(extendedMonths.value);

  const dates = [];
  const endDate = new Date(today);
  endDate.setMonth(today.getMonth() + months);

  const currentDate = new Date(today);

  const diff = (dayOfWeek - currentDate.getDay() + 7) % 7;
  currentDate.setDate(currentDate.getDate() + diff);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }

  selectedDates.value = dates;
};

// Watch for changes in weekday or months to recalculate dates
watch([selectedWeekday, extendedMonths], calculateDates);

// Form submission handler
const handleSubmit = () => {
  console.log({
    name: eventName.value,
    weekday: selectedWeekday.value,
    extendedMonths: extendedMonths.value,
    calculatedDates: selectedDates.value,
    responsibleUser: responsibleUser.value,
    users: selectedUsers.value,
    area: selectedArea.value,
  });

  var events = selectedDates.value.map((d) => ({
    title: eventName.value,
    start: d,
    backgroundColor: "#9f9900",
  }));
  calendarOptions.value.events = [...calendarOptions.value.events, ...events];

  // Clear form after submission
  eventName.value = "";
  selectedWeekday.value = "";
  extendedMonths.value = 1;
  selectedDates.value = [];
  responsibleUser.value = "";
  selectedUsers.value = [];
  selectedArea.value = "";
};

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  weekends: true,
  events: [
    { title: "Meeting", start: new Date() },
    {
      title: "Lunch",
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      backgroundColor: "#378006",
    },
    {
      title: "Conference",
      start: new Date(new Date().setDate(new Date().getDate() - 2)),
      end: new Date(new Date().setDate(new Date().getDate())),
      backgroundColor: "#3788d8",
    },
    {
      title: "Interview",
      start: new Date(new Date().setDate(new Date().getDate() + 5)),
      backgroundColor: "#9c27b0",
    },
    {
      title: "Workshop",
      start: new Date(new Date().setDate(new Date().getDate() + 10)),
      backgroundColor: "#f44336",
    },
    {
      title: "Deadline",
      start: new Date(new Date().setDate(new Date().getDate() + 15)),
      backgroundColor: "#ff9800",
    },
  ],
  editable: true,
  selectable: true,
  datesSet: (dateInfo) => {
    console.log("datesSet event triggered:", dateInfo);
  },
  dateClick: (info) => {
    console.log("Date clicked:", info);
    console.log(calendarOptions.value.events);
  },
});
</script>

<template>
  <div class="app-container">
    <div class="form-container">
      <h2>Event Form</h2>
      <form @submit.prevent="handleSubmit">
        <!-- Name Field -->
        <div class="form-group">
          <label for="eventName">Name</label>
          <input
            id="eventName"
            type="text"
            v-model="eventName"
            class="form-control"
            placeholder="Event name"
            required
          />
        </div>

        <!-- Weekday Select Field -->
        <div class="form-group">
          <label for="selectedWeekday">Week Day</label>
          <select
            id="selectedWeekday"
            v-model="selectedWeekday"
            class="form-control"
            required
          >
            <option value="">Select a weekday</option>
            <option v-for="day in weekdays" :key="day.value" :value="day.value">
              {{ day.name }}
            </option>
          </select>
        </div>

        <!-- Extended Months Field -->
        <div class="form-group">
          <label for="extendedMonths">Extended for (months)</label>
          <input
            id="extendedMonths"
            type="number"
            v-model="extendedMonths"
            class="form-control"
            min="1"
            max="12"
            required
          />
        </div>

        <!-- Preview of calculated dates -->
        <div class="form-group" v-if="selectedDates.length > 0">
          <label>Calculated Dates</label>
          <div class="dates-preview">
            <div
              v-for="(date, index) in selectedDates"
              :key="index"
              class="date-item"
            >
              {{ date.toLocaleDateString() }}
            </div>
          </div>
        </div>

        <!-- Responsible User Field (Select) -->
        <div class="form-group">
          <label for="responsibleUser">Responsible User</label>
          <select
            id="responsibleUser"
            v-model="responsibleUser"
            class="form-control"
            required
          >
            <option value="">Select a user</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <!-- Users Field (MultiSelect) -->
        <div class="form-group">
          <label for="selectedUsers">Users</label>
          <select
            id="selectedUsers"
            v-model="selectedUsers"
            class="form-control"
            multiple
          >
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
          <small>Hold Ctrl/Cmd to select multiple users</small>
        </div>

        <!-- Area Field (Select) -->
        <div class="form-group">
          <label for="selectedArea">Area</label>
          <select
            id="selectedArea"
            v-model="selectedArea"
            class="form-control"
            required
          >
            <option value="">Select an area</option>
            <option v-for="area in areas" :key="area.id" :value="area.id">
              {{ area.name }}
            </option>
          </select>
        </div>

        <button type="submit" class="btn-submit">Save Event</button>
      </form>
    </div>

    <div class="calendar-container">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>
<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.calendar-container {
  max-width: 100%;
}

.form-container {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

select[multiple] {
  height: 120px;
}

small {
  display: block;
  color: #666;
  margin-top: 5px;
  font-size: 12px;
}

.btn-submit {
  background-color: #3788d8;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-submit:hover {
  background-color: #2c6cb0;
}

@media (min-width: 768px) {
  .app-container {
    flex-direction: row;
  }

  .form-container {
    flex: 0 0 350px;
    margin-bottom: 0;
    margin-right: 20px;
  }

  .calendar-container {
    flex: 1;
  }
}

.dates-preview {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  max-height: 150px;
  overflow-y: auto;
  background-color: #fff;
}

.date-item {
  padding: 4px 8px;
  border-bottom: 1px solid #eee;
}

.date-item:last-child {
  border-bottom: none;
}
</style>
