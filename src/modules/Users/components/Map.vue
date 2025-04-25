<script setup>
import { onMounted } from "vue";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import Circle from "ol/geom/Circle";
import { Fill, Stroke, Style } from "ol/style";
import Modify from "ol/interaction/Modify";
import Translate from "ol/interaction/Translate"; // Import Translate interaction
import { Select } from "ol/interaction"; // Import Select interaction

onMounted(() => {
  const vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 0, 0, 0.2)",
      }),
      stroke: new Stroke({
        color: "red",
        width: 2,
      }),
    }),
  });

  const map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      vectorLayer,
    ],
    view: new View({
      center: [0, 0],
      zoom: 3, // Further zoomed out
    }),
  });

  const polygonCoords = [
    [
      [-5000000, -1000000],
      [-5000000, 1000000],
      [-3000000, 1000000],
      [-3000000, -1000000],
      [-5000000, -1000000],
    ],
  ];

  const polygon = new Feature({
    geometry: new Polygon(polygonCoords),
  });

  vectorSource.addFeature(polygon);

  const circle = new Feature({
    geometry: new Circle([0, 0], 1000000), // Center at [0, 0] with radius 1,000,000
  });

  circle.setStyle(
    new Style({
      fill: new Fill({
        color: "rgba(0, 0, 255, 0.2)", // Blue fill
      }),
      stroke: new Stroke({
        color: "blue",
        width: 2,
      }),
    })
  );

  vectorSource.addFeature(circle);

  const modify = new Modify({
    source: vectorSource,
  });
  map.addInteraction(modify);

  const select = new Select();
  map.addInteraction(select);

  const translate = new Translate({
    features: select.getFeatures(),
  });
  map.addInteraction(translate);

  map.getView().fit(polygon.getGeometry().getExtent(), {
    padding: [50, 50, 50, 50],
    duration: 1000,
  });
});
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 500px;
}
</style>
