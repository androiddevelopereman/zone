<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    data-bs-backdrop="false"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ isEditMode ? $t("Edit Student") : $t("Add Student") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div :style="{ display: 'flex', justifyContent: 'space-between' }">
              <div class="mb-3">
                <label for="name" class="form-label"
                  >{{ $t("Full Name")
                  }}<span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  placeholder="Ex:Ahmed Mohamed"
                  v-model="user.name"
                  id="name"
                  class="form-control"
                  required
                  minlength="3"
                />
              </div>
              <div class="mb-3">
                <label for="dateof" class="form-label"
                  >{{ $t("Date Of Birth")
                  }}<span class="text-danger">*</span></label
                >
                <input
                  type="date"
                  id="dateof"
                  v-model="user.dateof"
                  class="form-control"
                  required
                />
              </div>
            </div>
            <div :style="{ display: 'flex', justifyContent: 'space-between' }">
              <div class="mb-3">
                <label for="email" class="form-label"
                  >{{ $t("Email") }}<span class="text-danger">*</span></label
                >
                <input
                  type="email"
                  placeholder="text@gmail.com"
                  id="email"
                  v-model="user.email"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label"
                  >{{ $t("Phone") }}<span class="text-danger">*</span></label
                >
                <input
                  type="tel"
                  id="phone"
                  v-model="user.phone"
                  class="form-control"
                  required
                  pattern="^[0-9]+$"
                  inputmode="numeric"
                  @input="validatePhone"
                />
              </div>
            </div>

            <div :style="{ display: 'flex', justifyContent: 'space-between' }">
              <div class="mb-3 w-50">
                <label for="grade" class="form-label"
                  >{{ $t("Grade level")
                  }}<span class="text-danger">*</span></label
                >
                <select
                  id="grade"
                  class="form-select"
                  v-model="user.grade"
                  required
                >
                  <option value="1">{{ $t("1") }}</option>
                  <option value="2">{{ $t("2") }}</option>
                  <option value="3">{{ $t("3") }}</option>
                  <option value="4">{{ $t("4") }}</option>
                  <option value="5">{{ $t("5") }}</option>
                  <option value="6">{{ $t("6") }}</option>
                </select>
              </div>
              <div class="mb-3"></div>
            </div>
            <div class="mb-3">
              <label for="shift" class="form-label"
                >{{ $t("Shift") }}<span class="text-danger">*</span></label
              >
              <select
                id="shift"
                class="form-select"
                v-model="user.shift"
                required
              >
                <option value="A">{{ $t("A") }}</option>
                <option value="B">{{ $t("B") }}</option>
                <option value="C">{{ $t("C") }}</option>
              </select>
            </div>
            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary" id="saveButton">
                {{ isEditMode ? $t("Update") : $t("Save") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { defineProps, defineEmits } from "vue";

// Define props
const props = defineProps({
  isEditMode: Boolean,
  user: Object,
});

const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const userIdToEdit = ref(null);
const userModalRef = ref(null);
const isPasswordMatched = ref(false);

const passwordStrength = computed(() => {
  if (password.value.length === 0) return "initial";
  if (password.value.length < 6) return "weak";
  if (password.value.match(/^(?=.[a-z])(?=.[A-Z])(?=.*[0-9]).{6,}$/))
    return "strong";
  return "medium";
});

const passwordStrengthColor = computed(() => {
  switch (passwordStrength.value) {
    case "initial":
      return "gray";
    case "weak":
      return "red";
    case "medium":
      return "orange";
    case "strong":
      return "green";
    default:
      return "transparent";
  }
});

const passwordStrengthWidth = computed(() => {
  switch (passwordStrength.value) {
    case "initial":
      return "0%";
    case "weak":
      return "33%";
    case "medium":
      return "66%";
    case "strong":
      return "100%";
    default:
      return "0%";
  }
});

const emit = defineEmits(["submitForm"]);

const handleSubmit = () => {
  console.log("Handling submit...");

  if (!props.isEditMode && password.value !== confirmPassword.value) {
    errorMessage.value = "password do not match!";
    isPasswordMatched.value = false;
    return;
  } else {
    errorMessage.value = "";
    isPasswordMatched.value = true;
  }

  const formData = { ...props.user };
  if (!props.isEditMode) {
    formData.password = password.value;
  }

  emit("submitForm", formData);

  resetForm();
};
const validatePhone = (event) => {
  user.phone = event.target.value.replace(/\D/g, "");
};

const resetForm = () => {
  props.user.name = "";
  props.user.dateof = "";
  props.user.email = "";
  props.user.phone = "";
  props.user.grade = "";
  props.user.shift = "";
  password.value = "";
  confirmPassword.value = "";
  errorMessage.value = "";
};
</script>
