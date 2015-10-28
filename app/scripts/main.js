'use strict';

function setCookie(location){
  var d = new Date();
  d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
  var expires = 'expires=' + d.toUTCString();
  document.cookie = 'location=' + location + '; ' + expires;
}
