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
})