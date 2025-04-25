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
    meta: { title: "Loginpage" },
  },
  {
    path: "/Users",
    name: "UsersView",
    component: UsersView,
    meta: { title: "Users And Accounts" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { title: "Dashboard" },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { title: "Profile" },
  },
  {
    path: "/reports",
    name: "Reports",
    component: Reports,
    meta: { title: "Reports" },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: { title: "Settings" },
  },
  {
    path: "/drivers",
    name: "Drivers",
    component: Drivers,
    meta: { title: "Drivers" },
  },
  {
    path: "/students",
    name: "Students",
    component: Students,
    meta: { title: "Students" },
  },
  {
    path: "/userprofile",
    name: "UserProfile",
    component: UserProfile,
    meta: { title: "UserProfile" },
  },
  {
    path: "/charts",
    name: "Charts",
    component: Charts,
    meta: { title: "Charts" },
  },
  {
    path: "/columnchart",
    name: "ColumnChart",
    component: ColumnChart,
    meta: { title: "ColumnChart" },
  },
  {
    path: "/barchart",
    name: "BarChart",
    component: BarChart,
    meta: { title: "BarChart" },
  },
  {
    path: "/donutchart",
    name: "DonutChart",
    component: DonutChart,
    meta: { title: "DonutChart" },
  },
  {
    path: "/piechart",
    name: "PieChart",
    component: PieChart,
    meta: { title: "PieChart" },
  },
  {
    path: "/speedometerchart",
    name: "SpeedometerChart",
    component: SpeedometerChart,
    meta: { title: "SpeedometerChart" },
  },
  {
    path: "/calenderfunction",
    name: "CalenderFunction",
    component: CalenderFunction,
    meta: { title: "CalenderFunction" },
  },
  {
    path: "/mapview",
    name: "MapView",
    component: MapView,
    meta: { title: "MapView" },
  },
  {
    path: "/zonesmodule",
    name: "ZonesModule",
    component: ZonesModule,
    meta: { title: "ZonesModule" },
  },
  {
    path: "/addzone",
    name: "AddZone",
    component: AddZone,
    meta: { title: "AddZone" },
  },
  {
    path: "/editzone",
    name: "EditZone",
    component: EditZone,
    meta: { title: "EditZone" },
  },

  {
    path: "/accounts",
    name: "Accounts",
    component: Accounts,
    meta: { title: "Accounts" },
  },
  {
    path: "/business",
    name: "Business",
    component: Business,
    meta: { title: "Business" },
  },
  {
    path: "/user-info",
    name: "UserInfo",
    component: UserInfo,
    meta: { title: "UserInfo" },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Default Title";
  next();
});

export default router;
