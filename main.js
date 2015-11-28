// wait for DOM to load before running JS
$(function() {

	var quakesUrl = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';
	var $quakesList = $('#quakes-list');
	var map;

	// Compile handlebars template
		var source = $('#quakes-template').html();
		var template = Handlebars.compile(source);

	// custom handlebars helper for formatting time in hours ago
	Handlebars.registerHelper('hoursAgo', function (time) {
		var hoursAgo = Math.round((Date.now() - time) / (1000*60*60));
		return hoursAgo + ' hours ago';
	});

	Handlebars.registerHelper('dateHappened', function (time) {
		var dateHappened = new Date(time);
		return dateHappened;
	});

	// display map on the page
	var createMap = function() {
    	map = new google.maps.Map(document.getElementById('map'), {
      	center: { lat: 37.78, lng: -122.44 },
      	zoom: 3
    	});
  	};

	$.get(quakesUrl, function(data) {
		console.log(data);
		var quakesData = data.features;

		// Pass in HTML and append to page
		var quakeHTML = template({quakes: quakesData});
		$quakesList.append(quakeHTML);	

		quakesData.forEach(function (quake) {
			var latitude = quake.geometry.coordinates[1];
			var longtitude = quake.geometry.coordinates[0];
			new google.maps.Marker({
				position: new google.maps.LatLng(latitude, longtitude),
				map: map,
				title: quake.properties.title,
				icon: 'earthquake.png' 
			});
		});

	});
	createMap();

});