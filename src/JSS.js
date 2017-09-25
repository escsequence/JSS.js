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
    Allows ease use of JSS file formats to in place of CSS

    Copyright 2017 James Johnston

    Permission is hereby granted, free of charge, to any person obtaining a copy of this
    software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
    and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
    PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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

// Will convert CSS to JSS
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
