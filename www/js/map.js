var baseMap = new ol.layer.Tile({ source: new ol.source.OSM()});
var map= new ol.Map({
	layers: [baseMap],
	target: 'map',
	controls: ol.control.defaults({
		attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
			collapsible: false
		})
	}),
	view: new ol.View({
		center: [-5.2218, 33.43806],
		projection: 'EPSG:4326',
		zoom: 14
	})
});

$('#geolocateMe').click(function(){
	var geolocation = new ol.Geolocation({
		projection: 'EPSG:4326'
	});
	geolocation.setTracking(true);

	var accuracyFeature = new ol.Feature();
	geolocation.on('change:accuracyGeometry', function() {
		accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
	});

	var positionFeature = new ol.Feature();
	positionFeature.setStyle(new ol.style.Style({
		image: new ol.style.Circle({
			radius: 6,
			fill: new ol.style.Fill({
				color: '#3399CC'
			}),
			stroke: new ol.style.Stroke({
				color: '#fff',
				width: 2
			})
		})
	}));

	geolocation.on('change:position', function() {
		var coordinates = geolocation.getPosition();
		positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
	});

	geolocation.on('error', function(error) {
		console.log(error);
	});

	var myPosition=new ol.layer.Vector({
		map: map,
		source: new ol.source.Vector({
			features: [accuracyFeature, positionFeature]
		})
	});	
});

// ends here

// vector layers containing data from the geojson files
var layers = new Object();

var clusterSourceBank = new ol.source.Cluster({
	distance: 40,
	source: sources['bank']
});

var clusterSourceHotel = new ol.source.Cluster({
	distance: 40,
	source: sources['hotel']
});

var styleCache = {};
layers['bank'] = new ol.layer.Vector({
	source: clusterSourceBank,
	visible: false,
	style: function(feature) {
		var size = feature.get('features').length;
		var style = styleCache[size];
		if (!style) {
			style = new ol.style.Style({
				image: new ol.style.Circle({
					radius: 10,
					stroke: new ol.style.Stroke({
						color: '#fff'
					}),
					fill: new ol.style.Fill({
						color: '#3399CC'
					})
				}),
				text: new ol.style.Text({
					text: size.toString(),
					fill: new ol.style.Fill({
						color: '#fff'
					})
				})
			});
			styleCache[size] = style;
		}
		if(size==1){
			console.log('length of the cluster is 1');
			return (new ol.style.Style({
				image: new ol.style.Icon({
					anchor: [0.5, 0],
					anchorOrigin: 'bottom-left',
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					src: 'img/marker-bank.png'
				})
			}));
		}
		return style;
	}
});

layers['hotel'] = new ol.layer.Vector({
	source: clusterSourceHotel,
	visible: false,
	style: function(feature) {
		var size = feature.get('features').length;
		var style = styleCache[size];
		if (!style) {
			style = new ol.style.Style({
				image: new ol.style.Circle({
					radius: 10,
					stroke: new ol.style.Stroke({
						color: '#fff'
					}),
					fill: new ol.style.Fill({
						color: '#3399CC'
					})
				}),
				text: new ol.style.Text({
					text: size.toString(),
					fill: new ol.style.Fill({
						color: '#fff'
					})
				})
			});
			styleCache[size] = style;
		}
		if(size==1){
			return (new ol.style.Style({
				image: new ol.style.Icon({
					anchor: [0.5, 0],
					anchorOrigin: 'bottom-left',
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					src: 'img/marker-hotel.png'
				})
			}));
		}
		return style;
	}
});

map.addLayer(layers['bank']);
map.addLayer(layers['hotel']);
$(".selectCategory").click(function(){
	console.log(this.id);
	
		for( var layer in layers){
			layers[layer].setVisible(false);
		}
		if(layers[this.id]){
			layers[this.id].setVisible(true);
		}
	
});