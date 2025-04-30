<script setup>
import { ref, onMounted } from "vue";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import { Fill, Stroke, Style } from "ol/style";
import Modify from "ol/interaction/Modify";
import Translate from "ol/interaction/Translate";
import { Select } from "ol/interaction";
import axios from "axios";
import { fromLonLat, transform } from "ol/proj";
import { useRoute } from "vue-router";

const map = ref(null);
const vectorSource = new VectorSource();
const zoneData = ref(null);
const zoneFeature = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();
const zoneId = ref(route.params.id);
const isSaving = ref(false); // Add saving state
const saveError = ref(null);
const saveSuccess = ref(false);

const config = {
  domain: "https://1e873a6d-c5d6-4e2f-bdef-d15843dea8ac.mock.pstmn.io",
  token: "your-auth-token",
  selectedAccount: "1",
};

const initializeMap = () => {
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      fill: new Fill({
        color: "rgba(0, 150, 255, 0.3)",
      }),
      stroke: new Stroke({
        color: "blue",
        width: 2,
      }),
    }),
  });

  map.value = new Map({
    target: "map-edit",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      vectorLayer,
    ],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });

  const select = new Select();
  map.value.addInteraction(select);

  const modify = new Modify({
    features: select.getFeatures(),
  });
  map.value.addInteraction(modify);

  const translate = new Translate({
    features: select.getFeatures(),
  });
  map.value.addInteraction(translate);

  modify.on("modifyend", (event) => {
    const modifiedFeature = event.features.getArray()[0];
    if (modifiedFeature) {
      // Call saveChanges after modification ends
      saveChanges(modifiedFeature.getGeometry());
    }
  });

  translate.on("translateend", (event) => {
    const translatedFeature = event.features.getArray()[0];
    if (translatedFeature) {
      // Call saveChanges after translation ends
      saveChanges(translatedFeature.getGeometry());
    }
  });
};

const fetchZoneData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios({
      method: "GET",
      url: `${config.domain}/zones/${zoneId.value}`,
      headers: {
        "Selected-Account": config.selectedAccount,
        Authorization: `Bearer ${config.token}`,
        Accept: "application/json",
      },
    });

    if (response.data && response.data.status === "success") {
      zoneData.value = response.data.result;
      displayZonePolygon();
    } else {
      throw new Error(response.data.message || "Failed to fetch zone data");
    }
  } catch (err) {
    console.error("Error fetching zone data:", err);
    error.value = `Error: ${err.message || "Could not load zone data"}`;
  } finally {
    loading.value = false;
  }
};

const displayZonePolygon = () => {
  if (
    !zoneData.value ||
    !zoneData.value.coordinates ||
    zoneData.value.coordinates.length === 0
  ) {
    error.value = "Zone data does not contain valid coordinates.";
    return;
  }

  try {
    const transformedCoords = zoneData.value.coordinates[0].map((coord) =>
      fromLonLat([coord[0], coord[1]])
    );

    const polygon = new Polygon([transformedCoords]);
    zoneFeature.value = new Feature({
      geometry: polygon,
      name: zoneData.value.name,
      id: zoneData.value.id,
    });

    vectorSource.clear();
    vectorSource.addFeature(zoneFeature.value);

    const extent = polygon.getExtent();
    if (extent && extent.every(isFinite)) {
      map.value.getView().fit(extent, {
        padding: [100, 100, 100, 100],
        duration: 1000,
        maxZoom: 18,
      });
    } else {
      map.value.getView().setCenter(transformedCoords[0] || [0, 0]);
      map.value.getView().setZoom(15);
    }
  } catch (err) {
    console.error("Error creating polygon feature:", err);
    error.value = "Failed to display zone polygon on map.";
  }
};

// Function to save the modified coordinates via PUT request
const saveChanges = async (geometry) => {
  if (!(geometry instanceof Polygon) || !zoneData.value) {
    console.error("Cannot save: Invalid geometry or missing zone data.");
    saveError.value = "Cannot save: Invalid geometry or missing zone data.";
    return;
  }

  isSaving.value = true;
  saveError.value = null;
  saveSuccess.value = false;

  try {
    const mapCoordinates = geometry.getCoordinates();
    // Transform coordinates back to geographic (EPSG:4326) for the API
    const apiCoordinates = mapCoordinates.map((ring) =>
      ring.map((coord) => transform(coord, "EPSG:3857", "EPSG:4326"))
    );

    console.log("Saving Modified Coordinates (EPSG:4326):", apiCoordinates);

    // Construct the payload based on the curl example and existing/modified data
    // Note: Some fields might need adjustment based on your actual requirements
    const payload = {
      name: zoneData.value.name || "Default Name", // Use existing name or a default
      clients: zoneData.value.clients || [], // Use existing clients or default
      default_customer_name: zoneData.value.default_customer_name || "",
      coordinates: apiCoordinates, // Use the modified coordinates
      // center_point: calculateCenterPoint(apiCoordinates), // Optional: Calculate center if needed
      description: zoneData.value.description || "Default Description",
      type: "polygon", // Assuming type remains polygon
      visibility: zoneData.value.visibility || "private",
      tags: zoneData.value.tags || [],
      zones_type: zoneData.value.zones_type || "project_areas", // Use existing or default
    };

    const response = await axios({
      method: "PUT",
      url: `${config.domain}/zones/${zoneData.value.id}`, // Use the actual zone ID
      headers: {
        "Selected-Account": config.selectedAccount,
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.token}`,
      },
      data: payload,
    });

    console.log("Update API Response:", response.data);
    saveSuccess.value = true;
    // Optionally provide user feedback
  } catch (err) {
    console.error("Error updating zone:", err);
    saveError.value = `Error updating zone: ${
      err.response?.data?.message || err.message || "Unknown error"
    }`;
    // Optionally revert the feature change on error or notify user
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  initializeMap();
  fetchZoneData();
});
</script>

<template>
  <div class="container">
    <h2>Edit Zone: {{ zoneData ? zoneData.name : `ID ${zoneId}` }}</h2>
    <div v-if="loading" class="loading">Loading zone data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div id="map-edit" class="map"></div>
    <p v-if="!loading && !error && !isSaving">
      Select the polygon to modify or move it. Changes saved automatically.
    </p>
    <p v-if="isSaving" class="saving-message">Saving changes...</p>
    <p v-if="saveSuccess" class="success-message">
      Changes saved successfully!
    </p>
    <p v-if="saveError" class="error-message">{{ saveError }}</p>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  width: 100%;
}

.map {
  width: 100%;
  height: 600px;
  /* Increased height */
  border: 1px solid #ccc;
  margin-top: 10px;
}

.loading,
.error {
  padding: 15px;
  margin-top: 10px;
  border-radius: 4px;
  text-align: center;
}

.loading {
  background-color: #e3f2fd;
}

.error {
  background-color: #ffebee;
  color: #d32f2f;
}

h2 {
  margin-bottom: 10px;
}

.saving-message {
  color: orange;
  text-align: center;
  margin-top: 10px;
}

.success-message {
  color: green;
  text-align: center;
  margin-top: 10px;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
