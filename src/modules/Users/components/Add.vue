<script setup>
import { ref, onMounted, watch } from "vue";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Draw } from "ol/interaction";
import { Polygon, LineString, Point, Circle } from "ol/geom";
import axios from "axios";
import { transform } from "ol/proj";

const map = ref(null);
const vectorSource = new VectorSource();
const drawnGeometry = ref(null);
const drawInteraction = ref(null);
const zoneName = ref("");
const zoneDescription = ref("");
const isSaving = ref(false);
const saveError = ref(null);
const saveSuccess = ref(false);
const geometryType = ref("polygon");

//TODO: Eman
const config = {
  domain: "https://1e873a6d-c5d6-4e2f-bdef-d15843dea8ac.mock.pstmn.io",
  selectedAccount: "your-account-id",
  token: "your-auth-token",
};

const updateDrawInteraction = () => {
  if (drawInteraction.value) {
    map.value.removeInteraction(drawInteraction.value);
  }
  
  let type = "Polygon";
  switch (geometryType.value) {
    case "linestring":
      type = "LineString";
      break;
    case "point":
      type = "Point";
      break;
    case "circle":
      type = "Circle";
      break;
    default:
      type = "Polygon";
  }
  
  drawInteraction.value = new Draw({
    source: vectorSource,
    type: type,
  });
  
  map.value.addInteraction(drawInteraction.value);
  
  drawInteraction.value.on("drawstart", () => {
    vectorSource.clear();
    drawnGeometry.value = null;
    saveSuccess.value = false;
    saveError.value = null;
  });
  
  drawInteraction.value.on("drawend", (event) => {
    drawnGeometry.value = event.feature.getGeometry();
  });
};

const initializeMap = () => {
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  map.value = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      vectorLayer,
    ],
    view: new View({
      center: [0, 0],
      zoom: 3,
    }),
  });

  updateDrawInteraction();
};

watch(geometryType, () => {
  if (map.value) {
    vectorSource.clear();
    drawnGeometry.value = null;
    updateDrawInteraction();
  }
});

const saveZone = async () => {
  if (!drawnGeometry.value) {
    saveError.value = "Please draw on the map first.";
    return;
  }
  if (!zoneName.value) {
    saveError.value = "Please enter a name for the zone.";
    return;
  }

  isSaving.value = true;
  saveError.value = null;
  saveSuccess.value = false;

  try {
    let coordinates;
    let radius;
    
    switch(geometryType.value) {
      case "polygon":
        coordinates = drawnGeometry.value.getCoordinates().map(ring =>
          ring.map(coord => transform(coord, "EPSG:3857", "EPSG:4326"))
        );
        break;
      case "linestring":
        coordinates = drawnGeometry.value.getCoordinates().map(coord => 
          transform(coord, "EPSG:3857", "EPSG:4326")
        );
        break;
      case "point":
        coordinates = transform(drawnGeometry.value.getCoordinates(), "EPSG:3857", "EPSG:4326");
        break;
      case "circle":
        const center = drawnGeometry.value.getCenter();
        coordinates = transform(center, "EPSG:3857", "EPSG:4326");
        // Get radius in meters
        radius = drawnGeometry.value.getRadius();
        break;
    }

    const payload = {
      name: zoneName.value,
      description: zoneDescription.value || "Default description",
      type: geometryType.value,
      zones_type: "",
      visibility: "private",
      coordinates: coordinates,
      tags: [],
      longitude: "",
      latitude: "",
      expected_visits: [],
      default_customer_name: `${zoneName.value} - customer`,
      clients: [],
    };
    
    // Add radius if it's a circle
    if (geometryType.value === "circle" && radius) {
      payload.radius = radius;
    }

    const response = await axios({
      method: "POST",
      url: `${config.domain}/zones`,
      headers: {
        "Selected-Account": config.selectedAccount,
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.token}`,
      },
      data: payload,
    });

    console.log("API Response:", response.data);
    saveSuccess.value = true;

    zoneName.value = "";
    zoneDescription.value = "";
    vectorSource.clear();
    drawnGeometry.value = null;
  } catch (err) {
    console.error("Error saving zone:", err);
    saveError.value = `Error saving zone: ${
      err.response?.data?.message || err.message || "Unknown error"
    }`;
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  initializeMap();
});
</script>

<template>
  <div class="container">
    <div id="map" class="map"></div>

    <div class="form-container">
      <select v-model="geometryType" class="input-field">
        <option value="polygon">Polygon</option>
        <option value="linestring">Line String</option>
        <option value="point">Point</option>
        <option value="circle">Circle</option>
      </select>
      
      <input
        type="text"
        v-model="zoneName"
        placeholder="Zone Name"
        class="input-field"
      />
      <input
        type="text"
        v-model="zoneDescription"
        placeholder="Zone Description"
        class="input-field"
      />
      <button @click="saveZone" class="save-button" :disabled="isSaving">
        {{ isSaving ? "Saving..." : "Save Drawn Zone" }}
      </button>
      <p v-if="saveSuccess" class="success-message">Zone saved successfully!</p>
      <p v-if="saveError" class="error-message">{{ saveError }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.map {
  width: 100%;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  /* Limit form width */
}

.input-field {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.save-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-button:hover:not(:disabled) {
  background-color: #45a049;
}

.save-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success-message {
  color: green;
  text-align: center;
}

.error-message {
  color: red;
  text-align: center;
}
</style>
