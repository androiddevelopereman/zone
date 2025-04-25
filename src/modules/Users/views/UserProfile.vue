<template>
  <div class="app-container">
    <Sidebar />

    <div class="content-bar">
      <NavBar />
      <hr />

      <ProfileSidebar />
    </div>
  </div>
</template>
<script setup>
import Sidebar from "../components/Sidebar.vue";
import ProfileSidebar from "../components/ProfileSidebar.vue";
import NavBar from "../components/NavBar.vue";
</script>

<style scoped>
.app-container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f5fa;
  display: flex;
}

.content-bar {
  background-color: #f0f5fa;
  width: 100% !important;
}
</style>
