import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../modules/Users/views/Dashboard.vue";
import UsersView from "../modules/Users/views/UsersView.vue";
import Settings from "../modules/Users/views/Settings.vue";
import Reports from "../modules/Users/views/Reports.vue";
import Profile from "../modules/Users/views/Profile.vue";
import LoginPage from "../modules/Users/views/LoginPage.vue";
import UserProfile from "../modules/Users/views/UserProfile.vue";
import Accounts from "../modules/Users/components/Accounts.vue";
import Business from "../modules/Users/components/Business.vue";
import UserInfo from "../modules/Users/components/UserInfo.vue";
import Drivers from "../modules/Users/views/Drivers.vue";
import Students from "../modules/Users/views/Students.vue";
import Charts from "../modules/Users/views/Charts.vue";
import ColumnChart from "../modules/Users/views/ColumnChart.vue";
import BarChart from "../modules/Users/views/BarChart.vue";
import DonutChart from "../modules/Users/views/DonutChart.vue";
import PieChart from "../modules/Users/views/PieChart.vue";
import SpeedometerChart from "../modules/Users/views/SpeedometerChart.vue";
import CalenderFunction from "../modules/Users/views/CalenderFunction.vue";
import MapView from "../modules/Users/views/MapView.vue";
import ZonesModule from "../modules/Users/views/ZonesModule.vue";
import AddZone from "../modules/Users/views/AddZone.vue";
import EditZone from "../modules/Users/views/EditZone.vue";

const routes = [
  {
    path: "/",
    name: "LoginPage",
    component: LoginPage,
    meta: { title: "Loginpage", requiresAuth: false },
  },
  {
    path: "/Users",
    name: "UsersView",
    component: UsersView,
    meta: { title: "Users And Accounts", requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { title: "Dashboard", requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { title: "Profile", requiresAuth: true },
  },
  {
    path: "/reports",
    name: "Reports",
    component: Reports,
    meta: { title: "Reports", requiresAuth: true },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: { title: "Settings", requiresAuth: true },
  },
  {
    path: "/drivers",
    name: "Drivers",
    component: Drivers,
    meta: { title: "Drivers", requiresAuth: true },
  },
  {
    path: "/students",
    name: "Students",
    component: Students,
    meta: { title: "Students", requiresAuth: true },
  },
  {
    path: "/userprofile",
    name: "UserProfile",
    component: UserProfile,
    meta: { title: "UserProfile", requiresAuth: true },
  },
  {
    path: "/charts",
    name: "Charts",
    component: Charts,
    meta: { title: "Charts", requiresAuth: true },
  },
  {
    path: "/columnchart",
    name: "ColumnChart",
    component: ColumnChart,
    meta: { title: "ColumnChart", requiresAuth: true },
  },
  {
    path: "/barchart",
    name: "BarChart",
    component: BarChart,
    meta: { title: "BarChart", requiresAuth: true },
  },
  {
    path: "/donutchart",
    name: "DonutChart",
    component: DonutChart,
    meta: { title: "DonutChart", requiresAuth: true },
  },
  {
    path: "/piechart",
    name: "PieChart",
    component: PieChart,
    meta: { title: "PieChart", requiresAuth: true },
  },
  {
    path: "/speedometerchart",
    name: "SpeedometerChart",
    component: SpeedometerChart,
    meta: { title: "SpeedometerChart", requiresAuth: true },
  },
  {
    path: "/calenderfunction",
    name: "CalenderFunction",
    component: CalenderFunction,
    meta: { title: "CalenderFunction", requiresAuth: true },
  },
  {
    path: "/mapview",
    name: "MapView",
    component: MapView,
    meta: { title: "MapView", requiresAuth: true },
  },
  {
    path: "/zonesmodule",
    name: "ZonesModule",
    component: ZonesModule,
    meta: { title: "ZonesModule", requiresAuth: true },
  },
  {
    path: "/addzone",
    name: "AddZone",
    component: AddZone,
    meta: { title: "AddZone", requiresAuth: true },
  },
  {
    path: "/editzone/:id",
    name: "EditZone",
    component: EditZone,
    meta: { title: "EditZone", requiresAuth: true },
  },
  {
    path: "/accounts",
    name: "Accounts",
    component: Accounts,
    meta: { title: "Accounts", requiresAuth: true },
  },
  {
    path: "/business",
    name: "Business",
    component: Business,
    meta: { title: "Business", requiresAuth: true },
  },
  {
    path: "/user-info",
    name: "UserInfo",
    component: UserInfo,
    meta: { title: "UserInfo", requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Default Title";

  const isAuthenticated = localStorage.getItem("userData") !== null;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "LoginPage" });
  } else {
    next();
  }
});

export default router;
