// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});
  
  // Give each feature a popup that describes the place and time of the earthquake.
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
}

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);

// Function to determine marker size
function markerSize(magnitude) {
    return magnitude * 2000;
  };

  // Function to determine marker color by depth
function chooseColor(depth){
    if (depth < 10) return "lightgreen";
    else if (depth < 30) return "greenyellow";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "orangered";
    else return "red";
}

function createMap(earthquakesData) {
    //Popup that describes place and time 
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
    
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        
        // Point to layer used to alter markers
        pointToLayer: function(feature, latlng) {
        }
    });
    //Create earthquakes layer to the createMap
    createMap(earthquakes);
}

function createMap(earthquakes){
      // Create the base layers.
      var base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
    });

      // Create our map, giving it the streetmap and earthquakes layers to display on load.
      let myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [base, earthquakes]
    });

 // Add legend
 var legend = L.control({position: 'bottomright'});
 
 legend.onAdd = function() {
   var div = L.DomUtil.create('div", "info legend');
   var depth = [10, 30, 50, 70, 90];
   var labels = [];
   div.innerHTML += "<h4>Magnitude Level</h4>";

   for (var i = 0; i < depth.length; i++) {
     div.innerHTML +=
     '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
   }
   return div;
 };
 legend.addTo(myMap)
};
