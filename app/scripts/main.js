'use strict';

function goToRegion(region){
  //This function will actually do the page redirect
  window.location = '/' + region;
}

function setLocation(location, persist){
  //This function will set the location
  //And set in cookie storage depending on if the persist checkbox is selected
  if(persist){
    var d = new Date();
    //Save for 30 days
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    var expires = 'expires=' + d.toUTCString();
    document.cookie = 'location=' + location + '; ' + expires;
  }
  console.log(location + ', ' + persist);
  goToRegion(location);
}

function getLocation() {
  //This function will retrieve the location from the cookie
  var name = 'location=';
  var ca = document.cookie.split(';');
  for( var i = 0; i < ca.length; i++ ) {
      var c = ca[i];
      while (c.charAt(0) === ' ') { c = c.substring(1); }
      if (c.indexOf(name) === 0) { return c.substring(name.length, c.length); }
  }
  return '';
}

function deg2rad(deg){
  return deg * (Math.PI / 180);
}

function haversine(originLat, originLong, destLat, destLong){
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(destLat - originLat);  // deg2rad below
  var dLon = deg2rad(destLong - originLong);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(originLat)) * Math.cos(deg2rad(destLat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function nearestRegion(position){

  var regions = [
    ['baltimore', 39.179, -76.845],
    ['birmingham', 33.483, -86.702],
    ['orlando', 28.565, -81.163],
    ['tampa', 27.989, -82.736]
  ];

  var mindiff = 99999;
  var closest;

  for( var index = 0; index < regions.length; index++ ) {
    var diff = haversine(
                position.coords.latitude,
                position.coords.longitude,
                regions[index][1],
                regions[index][2]);
    if(diff < mindiff){
      closest = index;
      mindiff = diff;
    }
  }

  $.when($('#remember').prop('checked')).done(function(data){
    //Remember is a promise
    setLocation(regions[closest][0], data);
  });

}

function getGeoLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(nearestRegion);
  } else {
    // Geolocation API not supported
    console.log('No location');
  }
}

function clearLocation() {
  document.cookie = 'location=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  console.log('Location cleared');
}

function loadRegion(withGeo) {
  var region = getLocation();
  if (region !== '') {
    goToRegion(region);
    //clearLocation();
  } else {
    if(withGeo){
      console.log('Getting location');
      getGeoLocation();
    }
  }
}

function setRegionFromClick(region){
  $.when($('#remember').prop('checked')).done(function(data){
    //Remember is a promise
    setLocation(region, data);
  });
}

$(function(){
  //Page load
  if(location.search.split('clear=')[1]){
    //If there is a ?clear=1 in the URL, clear the location
    clearLocation();
  }

  $('#geo').on('click', function(e){
    //Bind to the #geo button. Runs loadRegion and find geo
    e.preventDefault();
    loadRegion(true);
  });

  $('.region-link').on('click', function(e){
    //Bind to the region links, sets the region statically
    e.preventDefault();
    //alert(JSON.stringify(e));
    var region = this.toString();
    var splitRegion = region.split( '/' );
    setRegionFromClick(splitRegion[splitRegion.length - 1]);
  });

  //After the binds, try to load the region from cookie or session storage
  loadRegion(false);

});
