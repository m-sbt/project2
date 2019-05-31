var map, places, infoWindow;
var markers = [];
var autocomplete;
var countryRestrict = {'country': []};
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');

var countries = {
	'at': {
		center: {lat: 47.516231, lng: 14.550072},
		zoom: 6 
	},
	'cz': {
		center: {lat: 50.083333 , lng: 14.466667},
		zoom: 6
	},
	'dk': {
		center: {lat: 56.26392, lng: 9.501785},
		zoom: 7 
	},
	'fi': {
		center: {lat: 64.92411, lng: 25.748151},
		zoom: 5
	},
	'fr': {
		center: {lat: 47, lng: 2.213749},
		zoom: 6
	},
	'de': {
		center: {lat: 51.165691, lng: 10.451526},
		zoom: 6
	},
	'gr': {
		center: {lat: 39.074208, lng: 21.824312},
		zoom: 6
	},
	'hu': {
		center: {lat: 47.162494, lng: 19.503304},
		zoom: 7
	},
	'ie': {
		center: {lat: 53.41291, lng: -8.24389},
		zoom: 6
	},
	'is': {
		center: {lat: 64.963051, lng: -19.020835},
		zoom: 6
	},
	'it': {
		center: {lat: 41.87194, lng: 12.56738},
		zoom: 5
	},
	'nl': {
		center: {lat: 52.132633, lng: 5.291266},
		zoom: 7
	},
	'no': {
		center: {lat: 60.472024, lng: 8.468946},
		zoom: 5
	},
	'pl': {
		center: {lat: 51.919438, lng: 19.145136},
		zoom: 6
	},
	'pt': {
		center: {lat: 39.399872, lng: -8.224454},
		zoom: 6
	},
	'sk': {
		center: {lat: 48.669026, lng: 19.699024},
		zoom: 7
	},
	'es': {
		center: {lat: 40.463667, lng: -3.74922},
		zoom: 6
	},
	'se': {
		center: {lat: 60.128161, lng: 18.643501},
		zoom: 5
	},
	'ch': {
		center: {lat: 46.818188, lng: 8.227512},
		zoom: 7
	},
	'uk': {
		center: {lat: 55.378051, lng: -3.435973},
		zoom: 5
	}
};

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 4,
	  center: {lat: 54.165691, lng: 10.451526},
	  mapTypeControl: false,
	  panControl: false,
	  zoomControl: false,
	  streetViewControl: false
	});

	infoWindow = new google.maps.InfoWindow({
	  content: document.getElementById('info-content')
	});

	// Create the autocomplete object and associate it with the UI input control.
	// Restrict the search to the default country, and to place type "cities".
	autocomplete = new google.maps.places.Autocomplete(
		/** @type {!HTMLInputElement} */ (
			document.getElementById('autocomplete')), {
		  types: ['(cities)'],
		  componentRestrictions: countryRestrict
		});
	places = new google.maps.places.PlacesService(map);

	autocomplete.addListener('place_changed', onPlaceChanged);
	
	// Add a DOM event listener to react when the user selects a country.
	document.getElementById('country').addEventListener('change', setAutocompleteCountry);

	// Radio button listeners
	document.getElementById("acommodationFilter").addEventListener('change', onPlaceChanged);
	document.getElementById("attractionsFilter").addEventListener('change', onPlaceChanged);
	document.getElementById("foodFilter").addEventListener('change', onPlaceChanged);
  }

// Checks which radio button is selected and returns an array with the desired place types
function radioButtonChecked(){
	var radioChecked = [];
	if(document.getElementById("acommodationFilter").checked){
		radioChecked = ['lodging'];
	}
	else if(document.getElementById("attractionsFilter").checked){
		radioChecked = ['art_gallery', 'museum', 'park'];
	}
	else if(document.getElementById("foodFilter").checked){
		radioChecked = ['restaurant', 'bar'];
	}
	return radioChecked;
}

  // When the user selects a city, get the place details for the city and
  // zoom the map in on the city.
  function onPlaceChanged() {
	var place = autocomplete.getPlace();
	if (place.geometry) {
	  map.panTo(place.geometry.location);
	  map.setZoom(14);
	  search();
	} else {
	  document.getElementById('autocomplete').placeholder = 'Enter a city';
	}
  }

  // Search for hotels in the selected city, within the viewport of the map.
  function search() {
	var search = {
	  bounds: map.getBounds(),
	  types: radioButtonChecked()
	};

	places.nearbySearch(search, function(results, status) {
	  if (status === google.maps.places.PlacesServiceStatus.OK) {
		clearResults();
		clearMarkers();
		// Create a marker for each hotel found, and
		// assign a letter of the alphabetic to each marker icon.
		for (var i = 0; i < results.length; i++) {
		  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
		  var markerIcon = MARKER_PATH + markerLetter + '.png';
		  // Use marker animation to drop the icons incrementally on the map.
		  markers[i] = new google.maps.Marker({
			position: results[i].geometry.location,
			animation: google.maps.Animation.DROP,
			icon: markerIcon
		  });
		  // If the user clicks a hotel marker, show the details of that hotel
		  // in an info window.
		  markers[i].placeResult = results[i];
		  google.maps.event.addListener(markers[i], 'click', showInfoWindow);
		  setTimeout(dropMarker(i), i * 100);

		  addResult(results[i], i);
		}
	  }
	});
  }

  function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
	  if (markers[i]) {
		markers[i].setMap(null);
	  }
	}
	markers = [];
  }

  // Set the country restriction based on user input.
  // Also center and zoom the map on the given country.
  function setAutocompleteCountry() {
	var country = document.getElementById('country').value;
	if (country == 'all') {
	  autocomplete.setComponentRestrictions({'country': []});
	  map.setCenter({lat: 54.165691, lng: 10.451526});
	  map.setZoom(4);
	} else {
	  autocomplete.setComponentRestrictions({'country': country});
	  map.setCenter(countries[country].center);
	  map.setZoom(countries[country].zoom);
	}
	clearResults();
	clearMarkers();
  }

  function dropMarker(i) {
	return function() {
	  markers[i].setMap(map);
	};
  }

  function addResult(result, i) {
	var results = document.getElementById('results');
	var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
	var markerIcon = MARKER_PATH + markerLetter + '.png';

	var tr = document.createElement('tr');
	tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
	tr.onclick = function() {
	  google.maps.event.trigger(markers[i], 'click');
	};

	var iconTd = document.createElement('td');
	var nameTd = document.createElement('td');
	var ratingTd = document.createElement('td');

	var icon = document.createElement('img');
	icon.src = markerIcon;
	icon.setAttribute('class', 'placeIcon');
	icon.setAttribute('className', 'placeIcon');

	var name = document.createTextNode(result.name);
	if(result.rating != null){
		var rating = document.createTextNode(result.rating + " (" + result.user_ratings_total + ")");
	}
	else{
		var rating = document.createTextNode("-");
	}

	iconTd.appendChild(icon);
	nameTd.appendChild(name);
	ratingTd.appendChild(rating);

	tr.appendChild(iconTd);
	tr.appendChild(nameTd);
	tr.appendChild(ratingTd);

	results.append(tr);
  }

  function clearResults() {
	var results = document.getElementById('results');
	while (results.childNodes[0]) {
	  results.removeChild(results.childNodes[0]);
	}
  }

  // Get the place details for a hotel. Show the information in an info window,
  // anchored on the marker for the hotel that the user selected.
  function showInfoWindow() {
	var marker = this;
	places.getDetails({placeId: marker.placeResult.place_id},
		function(place, status) {
		  if (status !== google.maps.places.PlacesServiceStatus.OK) {
			return;
		  }
		  infoWindow.open(map, marker);
		  buildIWContent(place);
		});
  }

  // Load the place information into the HTML elements used by the info window.
  function buildIWContent(place) {
	document.getElementById('iw-icon').innerHTML = '<img class="pop-upIcon" ' +
		'src="' + place.icon + '"/>';
	document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
		'">' + place.name + '</a></b>';
	document.getElementById('iw-address').textContent = place.vicinity;

	if (place.formatted_phone_number) {
	  document.getElementById('iw-phone-row').style.display = '';
	  document.getElementById('iw-phone').textContent =
		  place.formatted_phone_number;
	} else {
	  document.getElementById('iw-phone-row').style.display = 'none';
	}

	// Assign a five-star rating to the hotel, using a black star ('&#10029;')
	// to indicate the rating the hotel has earned, and a white star ('&#10025;')
	// for the rating points not achieved.
	if (place.rating) {
	  var ratingHtml = '';
	  for (var i = 0; i < 5; i++) {
		if (place.rating < (i + 0.5)) {
		  ratingHtml += '&#10025;';
		} else {
		  ratingHtml += '&#10029;';
		}
	  document.getElementById('iw-rating-row').style.display = '';
	  document.getElementById('iw-rating').innerHTML = ratingHtml;
	  }
	} else {
	  document.getElementById('iw-rating-row').style.display = 'none';
	}

	// The regexp isolates the first part of the URL (domain plus subdomain)
	// to give a short URL for displaying in the info window.
	if (place.website) {
	  var fullUrl = place.website;
	  var website = hostnameRegexp.exec(place.website);
	  if (website === null) {
		website = 'http://' + place.website + '/';
		fullUrl = website;
	  }
	  document.getElementById('iw-website-row').style.display = '';
	  document.getElementById('iw-website').textContent = website;
	} else {
	  document.getElementById('iw-website-row').style.display = 'none';
	}
  }




