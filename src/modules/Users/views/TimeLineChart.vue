<template>
  <div style="width: 100%; margin: 0 auto; height: 100%">
    <div class="page">
      <Sidebar />
      <div class="content-bar">
        <NavBar />

        <hr />
        <Time />
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from "../components/NavBar.vue";
import Sidebar from "../components/Sidebar.vue";
import Time from "../components/Time.vue";
</script>
<style scoped>
.page {
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
