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