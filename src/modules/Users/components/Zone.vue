<script setup>
import { onMounted, ref } from 'vue'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import 'ol/ol.css'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'
import { Fill, Stroke, Style } from 'ol/style'
import axios from 'axios'
import { transform, fromLonLat } from 'ol/proj'

const zones = ref([])
const loading = ref(true)
const error = ref(null)
const expandedZones = ref([])
const deletingZoneId = ref(null)

const config = {
    domain: 'https://1e873a6d-c5d6-4e2f-bdef-d15843dea8ac.mock.pstmn.io',
    selectedAccount: 'your-account-id',
    token: 'your-auth-token',
}

const fetchZones = async (map) => {
    loading.value = true
    error.value = null

    try {
        const response = await axios({
            method: 'GET',
            url: `${config.domain}/zones`,
            headers: {
                'Selected-Account': config.selectedAccount,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.token}`,
            },
        })

        if (response.data && response.data.status === 'success') {
            zones.value = response.data.result

            const vectorSource = new VectorSource()
            const vectorLayer = new VectorLayer({
                source: vectorSource,
            })
            map.addLayer(vectorLayer)

            let hasValidFeatures = false

            zones.value.forEach((zone) => {
                try {
                    if (!zone.coordinates || !zone.coordinates[0] || zone.coordinates[0].length < 3) {
                        console.warn(`Zone ${zone.id} has invalid coordinates. Skipping.`)
                        return
                    }
                    const r = Math.floor(Math.random() * 256)
                    const g = Math.floor(Math.random() * 256)
                    const b = Math.floor(Math.random() * 256)

                    const transformedCoords = zone.coordinates[0].map((coord) =>
                        fromLonLat([coord[0], coord[1]]),
                    )

                    const polygon = new Feature({
                        geometry: new Polygon([transformedCoords]),
                        id: zone.id,
                        name: zone.name,
                    })

                    polygon.setStyle(
                        new Style({
                            fill: new Fill({ color: `rgba(${r}, ${g}, ${b}, 0.2)` }),
                            stroke: new Stroke({ color: `rgb(${r}, ${g}, ${b})`, width: 2 }),
                        }),
                    )

                    vectorSource.addFeature(polygon)
                    hasValidFeatures = true
                } catch (err) {
                    console.error(`Error processing zone ${zone.id} for map:`, err)
                }
            })

            if (hasValidFeatures && vectorSource.getFeatures().length > 0) {
                try {
                    const extent = vectorSource.getExtent()
                    if (extent && extent.every(isFinite)) {
                        map.getView().fit(extent, {
                            padding: [50, 50, 50, 50],
                            duration: 1000,
                            maxZoom: 18,
                        })
                    } else {
                        console.warn('Could not fit map to invalid extent.')
                        map.getView().setCenter(fromLonLat([35.3, 32.3]))
                        map.getView().setZoom(9)
                    }
                } catch (fitError) {
                    console.error('Error fitting map view:', fitError)
                    map.getView().setCenter(fromLonLat([35.3, 32.3]))
                    map.getView().setZoom(9)
                }
            } else if (!hasValidFeatures) {
                map.getView().setCenter(fromLonLat([35.3, 32.3]))
                map.getView().setZoom(9)
            }
        } else {
            error.value = 'Failed to retrieve zones data'
        }
    } catch (err) {
        console.error('Error fetching zones:', err)
        error.value = `Error: ${err.message || 'Failed to fetch zones'}`
    } finally {
        loading.value = false
    }
}

const toggleCoordinates = (zoneId) => {
    if (expandedZones.value.includes(zoneId)) {
        expandedZones.value = expandedZones.value.filter((id) => id !== zoneId)
    } else {
        expandedZones.value.push(zoneId)
    }
}

const deleteZone = async (zoneId) => {
    if (!confirm(`Are you sure you want to delete zone ID ${zoneId}?`)) {
        return
    }

    deletingZoneId.value = zoneId
    error.value = null

    try {
        await axios({
            method: 'DELETE',
            url: `${config.domain}/zones/${zoneId}`,
            headers: {
                'Selected-Account': config.selectedAccount,
                Accept: 'application/json',
                Authorization: `Bearer ${config.token}`,
            },
        })

        zones.value = zones.value.filter((zone) => zone.id !== zoneId)

        const mapInstance = map.value
        if (mapInstance) {
            const layers = mapInstance.getLayers().getArray()
            layers.forEach((layer) => {
                if (layer instanceof VectorLayer) {
                    const source = layer.getSource()
                    const featureToRemove = source.getFeatureById(zoneId)
                    if (featureToRemove) {
                        source.removeFeature(featureToRemove)
                    } else {
                        const features = source.getFeatures()
                        const feature = features.find((f) => f.get('id') === zoneId)
                        if (feature) {
                            source.removeFeature(feature)
                        }
                    }
                }
            })
        }
    } catch (err) {
        console.error(`Error deleting zone ${zoneId}:`, err)
        error.value = `Error deleting zone: ${err.response?.data?.message || err.message || 'Unknown error'}`
    } finally {
        deletingZoneId.value = null
    }
}

const map = ref(null)

onMounted(() => {
    map.value = new Map({
        target: 'map',
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
        ],
        view: new View({
            center: fromLonLat([35.3, 32.3]),
            zoom: 9,
        }),
    })

    fetchZones(map.value)
})
</script>

<template>
    <div class="zones-container">
        <h1>Zones Information</h1>

        <div id="map"></div>
        <div v-if="loading" class="loading">Loading zones data...</div>

        <div v-else-if="error" class="error">
            {{ error }}
        </div>

        <div v-else>
            <div class="zones-count">Total zones: {{ zones.length }}</div>

            <table class="zones-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Visibility</th>
                        <th>Coordinates</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="zone in zones" :key="zone.id">
                        <td>{{ zone.id }}</td>
                        <td>{{ zone.name }}</td>
                        <td>{{ zone.description }}</td>
                        <td>{{ zone.type }}</td>
                        <td>{{ zone.visibility }}</td>
                        <td>
                            <button @click="toggleCoordinates(zone.id)">
                                {{ expandedZones.includes(zone.id) ? 'Hide' : 'Show' }} Coordinates
                            </button>
                            <div v-if="expandedZones.includes(zone.id)" class="coordinates">
                                <pre>{{ JSON.stringify(zone.coordinates, null, 2) }}</pre>
                            </div>
                        </td>
                        <td>
                            <button @click="deleteZone(zone.id)" class="delete-button"
                                :disabled="deletingZoneId === zone.id">
                                {{ deletingZoneId === zone.id ? 'Deleting...' : 'Delete' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
#map {
    width: 100%;
    height: 500px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.zones-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

h1 {
    color: #2c3e50;
    margin-bottom: 20px;
}

.loading,
.error {
    padding: 20px;
    text-align: center;
    border-radius: 4px;
}

.loading {
    background-color: #e3f2fd;
}

.error {
    background-color: #ffebee;
    color: #d32f2f;
}

.zones-count {
    margin-bottom: 16px;
    font-weight: bold;
}

.zones-table {
    width: 100%;
    border-collapse: collapse;
}

.zones-table th,
.zones-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.zones-table th {
    background-color: #f5f5f5;
    font-weight: bold;
}

.zones-table tr:hover {
    background-color: #f9f9f9;
}

.coordinates {
    margin-top: 8px;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
    overflow-x: auto;
}

button {
    padding: 6px 12px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

.delete-button {
    padding: 6px 12px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 5px;
}

.delete-button:hover:not(:disabled) {
    background-color: #d32f2f;
}

.delete-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
