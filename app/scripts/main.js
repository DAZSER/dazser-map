'use strict';

function setCookie(location){
  var d = new Date();
  d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
  var expires = 'expires=' + d.toUTCString();
  document.cookie = 'location=' + location + '; ' + expires;
}

function getCookie() {
  var name = 'location=';
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
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

  setCookie(regions[closest][1]);

}

function getLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(nearestRegion);
  } else {
    // Geolocation API not supported
  }
}

function loadRegion() {
    var region = getCookie();
    if (region !== '') {
        window.location = '/' + region;
    } else {
        getLocation();
    }
}

$(function(){
  loadRegion();
});
