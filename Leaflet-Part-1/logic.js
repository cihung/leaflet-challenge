// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  createMap(data.features);
});

// Function to determine marker size.
function markerSize(magnitude) {
  return magnitude * 2000;
}

// Function to determine marker color by depth.
function chooseColor(depth) {
  if (depth < 10) return "lightgreen";
  else if (depth < 30) return "greenyellow";
  else if (depth < 50) return "yellow";
  else if (depth < 70) return "orange";
  else if (depth < 90) return "orangered";
  else return "red";
}

// Function to create map.
function createMap(earthquakesData) {
  // Popup that describes place and time.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Create a GeoJSON layer with custom marker styling.
  var earthquakes = L.geoJSON(earthquakesData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.5,
        color: "black",
        weight: 0.3,
        stroke: true,
      };
      return L.circleMarker(latlng, markers);
    },
  });

  // Create the base layer.
  var base = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    zoomOffset: -1,
  });

  // Create the map, giving it the base and earthquakes layers to display.
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [base, earthquakes],
  });

  // Add legend.
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var depth = [10, 30, 50, 70, 90];
    var labels = [];
    div.innerHTML += "<h4>Magnitude Level</h4>";

    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        chooseColor(depth[i] + 1) +
        '"></i> ' +
        depth[i] +
        (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap);
}
