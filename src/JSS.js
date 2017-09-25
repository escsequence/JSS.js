/**
        ___  ________   ________             ___  ________
       |\  \|\   ____\ |\   ____\           |\  \|\   ____\
       \ \  \ \  \___|_\ \  \___|_          \ \  \ \  \___|_
     __ \ \  \ \_____  \\ \_____  \       __ \ \  \ \_____  \
    |\  \\_\  \|____|\  \\|____|\  \  ___|\  \\_\  \|____|\  \
    \ \________\____\_\  \ ____\_\  \|\__\ \________\____\_\  \
     \|________|\_________\\_________\|__|\|________|\_________\
               \|_________\|_________|              \|_________|

    JSON STYLE SHEET JAVASCRIPT LIBRARY (JSS.js)
    Allows ease use of JSS file formats in place of CSS.

    Molded together by James Johnston - 9/25/2017

    GNU GENERAL PUBLIC LICENSE

    Use for whatever you want, just make sure you share for free
    and don't mark as your own (aka be a jerk), thanks.
 *
 */
 var JSS = function() {}

 // References that link HTML to our JSS files
JSS.prototype.ref = JSS.ref = function() {
  let links = Array.from(document.getElementsByTagName("link"));
  let jlinks = [];
  links.forEach(function(item) {
    if (item.type === 'text/jss' && item.rel === 'stylesheet') {
      jlinks.push(item);
    }
  })
  return jlinks;
 }

 // Init the JSS engine and will load our JSON Style Sheet
JSS.prototype.init = JSS.init = function() {
  var json = this.load();
}

JSS.prototype.load = JSS.load = function() {
  var source = [];
  $.each(this.ref(), function(n, item) {
    $.when($.get(item.href))
      .done(function(response) {
        JSS.convert(response)
      });
  })
  return source;
}

// Converts JSON text -> JSON objects -> cssjson objects -> CSS
// Ughhhh. it suckkkksssss.
JSS.prototype.convert = JSS.convert = function(txtJson) {
  var json = JSON.parse(txtJson);
  var cssJSON = CSSJSON.convertJSON(json);
  var style = document.createElement("style");
  $.each(cssJSON, function(i, txt) {
    style.appendChild(document.createTextNode(txt))
  })
  document.head.appendChild(style)
}

$(document).ready(function() {
  JSS.init();
})
