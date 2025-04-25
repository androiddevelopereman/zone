<script setup>
import NavBar from "./modules/Users/components/NavBar.vue";
import UsersView from "./modules/Users/views/UsersView.vue";
// import UsersTable from './modules/Users/components/UsersTable.vue';
import Tabs from "./modules/Users/components/Tabs.vue";
import { RouterView, useRoute } from "vue-router";
import Sidebar from "./modules/Users/components/Sidebar.vue";
import Dashboard from "./modules/Users/views/Dashboard.vue";
import LoginPage from "./modules/Users/views/LoginPage.vue";
</script>
<template>
  <router-view></router-view>
</template>
<style scoped>
#app {
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
