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

// geolocation code starts here

var myPosition;

$('#geolocateMe').click(function(){
	var geolocation = new ol.Geolocation({
		projection: 'EPSG:4326',
		trackingOptions: {
			maximumAge: 10000,
			enableHighAccuracy: true,
			timeout: 600000
		}
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

	myPosition=new ol.layer.Vector({
		map: map,
		source: new ol.source.Vector({
			features: [accuracyFeature, positionFeature]
		})
	});	
});

// geolocation code ends here
//----------------------------------------------------
// vector layers containing data from the geojson files
var layers = new Object();
var sources = new Object();

sources['bank']= new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	projection: 'EPSG:4326',
	url: 'maps/banks.geojson'
});

sources['hotel']= new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	projection: 'EPSG:4326',
	url: 'maps/hotels.geojson'
});

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
	title: 'bank',
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
	title: 'hotel',
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

var tmpLayer= new ol.layer.Vector({
	title: 'search',
	source: new ol.source.Vector(),
	style: new ol.style.Style({
		image: new ol.style.Icon({
			anchor: [0.5, 0],
			anchorOrigin: 'bottom-left',
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			src: 'img/marker-result.png'
		})
	})
});

map.addLayer(tmpLayer);
map.addLayer(layers['bank']);
map.addLayer(layers['hotel']);
// data ends here
//------------------------------------------------
// layer toggle using the bootstrap menu
// begins here
$(".selectCategory").click(function(){
	for( var layer in layers){
		layers[layer].setVisible(false);
	}
	if(layers[this.id]){
		layers[this.id].setVisible(true);
	}
});
// layer toggle ends here
//---------------------------------------------
// quickSearch using the bootstrap menu
// code begins here

$('#quickSearch').click(function(){
	var name=$('#nameSearch').val();
	for ( var layer in layers){
		console.log("layer : "+layer+" visibile : "+layers[layer].getVisible());
		layers[layer].setVisible(true);
		console.log("layer : "+layer+" visibile : "+layers[layer].getVisible());
		layers[layer].getSource().getSource().changed();
		//console.log(layer+" "+JSON.stringify(layers[layer].getSource().getSource().getFeatures()));
		var src=layers[layer].getSource().getSource();
		console.log(src.getState()+" nbr of features : "+src.getFeatures().length);
		src.forEachFeature(function(feature){
					console.log('feature : '+feature.get('id'));
					if(feature.get('name').search(name)!=-1){
						console.log('found one');
						tmpLayer.getSource().addFeature(feature);
					}
				});
		/*layers[layer].getSource().getSource().on('change', function(evt){
			var src= evt.target;
			//console.log(src.getState());
			if(src.getState()=='ready'){
				//console.log('source is ready '+src.getUrl());
				src.forEachFeature(function(feature){
					console.log('feature : '+feature.get('id'));
					if(feature.get('name').search(name)!=-1){
						console.log('found one');
						tmpLayer.getSource().addFeature(feature);
					}
				});
			}
		});*/
	}
	tmpLayer.setVisible(true);
	for( var layer in layers){
		layers[layer].setVisible(false);
	}
});

// quickSearch ends here
//--------------------------------------------------
//displayModal when a feature is selected
//code begins here
map.on('singleclick', function(evt){
	var feature=map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
		if(layer!=myPosition){
			return feature;
		}
	});
	
	if(feature){
		//console.log(JSON.stringify(feature));
		$('#displayModalLabel').text(feature.get('name'));
		$('#displayModal').modal('show');
	}
});

//displayModal code ends here