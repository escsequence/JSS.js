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

    Molded together by James Johnston - 2017.

    Using portion of CSS-JSON Converter for JavaScript 2.1
    Copyright (c) 2013 Aram Kocharyan, http://aramk.com/

    GNU GENERAL PUBLIC LICENSE (idk link, sry), summary of it below...

    Use for whatever you want, just make sure you share for free
    and don't mark as your own (aka be a jerk), thanks.
 *
 */
 const _JSS_DEBUG_MODE = true; // This debug mode will log various things
 const _JSS_DEBUG_ENABLE_COMMENTS = true; // Debug mode and enable comments need to be enabled to see comments.
 const _JSS_OVERRIDE_NO_REUSE = false; // If enabled, JSS.js will not use src variables to reuse source files.


 var JSS = function() {}
 var strAttr = function (name, value, depth) {
     return '\t'.repeat(depth) + name + ': ' + value + ';\n';
 };
 var strNode = function (name, value, depth) {
     var cssString = '\t'.repeat(depth) + name + ' {\n';
     cssString += JSS.toCSS(value, depth + 1);
     cssString += '\t'.repeat(depth) + '}\n';
     return cssString;
 };

 JSS.prototype.srcLocation = JSS.srcLocation = [];
 JSS.prototype.srcCSS = JSS.srcCSS = [];
 JSS.prototype.srcJSS = JSS.srcJSS = [];

 JSS.prototype.convertJSON = JSS.convertJSON = function(json) {
   var cssNodes = [];
   $.each(json, function(name, item){
     var node = {
         children: {},
         attributes: {}
     };
     node.children[name] = [];
     node.children[name].children = [];
     node.children[name].attributes = [];

     var index = 0;
     $.each(item, function(child, attr) {
       node.children[name].attributes[child] = [];
       node.children[name].attributes[child].push(attr)
     })
     cssNodes.push(JSS.toCSS(node));
   })
   return cssNodes;
 }

 JSS.prototype.toCSS = JSS.toCSS = function (node, depth, breaks) {
     var cssString = '';
     if (typeof depth == 'undefined') {
         depth = 0;
     }
     if (typeof breaks == 'undefined') {
         breaks = false;
     }
     if (node.attributes) {
         for (i in node.attributes) {
             var att = node.attributes[i];
             if (att instanceof Array) {
                 for (var j = 0; j < att.length; j++) {
                     cssString += strAttr(i, att[j], depth);
                 }
             } else {
                 cssString += strAttr(i, att, depth);
             }
         }
     }
     if (node.children) {
         var first = true;
         for (i in node.children) {
             if (breaks && !first) {
                 cssString += '\n';
             } else {
                 first = false;
             }
             cssString += strNode(i, node.children[i], depth);
         }
     }
     return cssString;
 };

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
  JSS.log("-- Initialization of JSS --");
  this.load();
}

// Will load based on this.ref() - which checks for link tags
// fallback argument is loaded if nothing else if found
JSS.prototype.load = JSS.load = function(noref, file) {
  if (noref === undefined || noref === false) {
    var ref = this.ref();
    if (ref.length > 0) {
      JSS.log("Loaded link tags: " + ref);
      $.each(this.ref(), function(n, item) {
        JSS.loadFile(item.href, function(response) {
          JSS.apply(JSS.convert(response));
        });
      })
    } else {
        JSS.log("No link tags exist! No further work to do...");
    }
  } else {
    JSS.loadFile(file, function(response) {
      JSS.apply(JSS.convert(response));
    });
  }
}

// Converts JSON text -> JSON objects -> cssjson objects -> CSS
// Ughhhh. it suckkkksssss.
JSS.prototype.convert = JSS.convert = function(JSONtxt) {
  JSS.log("Converting JSON text/string: " + JSONtxt);
  return this.convertJSON(JSON.parse(JSONtxt));
}

/**
 *  loadFile function
 *  Will attempt to load a file and call the callback method
 *  after the file is finished loading - passes data in callback.
 */
JSS.prototype.loadFile = JSS.loadFile = function(file, callback) {
  JSS.log("Attempting to load file: " + file);
  if (!_JSS_OVERRIDE_NO_REUSE) {
    var exists = $.inArray(file, this.srcLocation);
  } else {
    exists = -1;
  }
  if (exists === -1) {
    try {
      $.when($.get(file))
        .done(function(response) {
          JSS.log("Loading file completed! Response: " + response);
          try {
            callback(response);

            if (!_JSS_OVERRIDE_NO_REUSE)
              JSS.srcLocation.push(file)

          } catch(err) {
            JSS.log("Callback method is required. Error: " + err);
          }
      });
    } catch(err) {
      JSS.log("Loading file failed! Error: " + err);
    }
  } else {
    JSS.log("Item has already been loaded, reusing...")
    this.apply(this.srcCSS[exists]);
  }
}

JSS.prototype.fromFile = JSS.fromFile = function(file) {
  this.load(true, file);
}

/**
 *  log function
 *  Logs data into console.log - yeeeeeeep.
 */
JSS.prototype.log = JSS.log = function(log) {
  if (_JSS_DEBUG_MODE && _JSS_DEBUG_ENABLE_COMMENTS)
    console.log("[JSS Debug Info]: " + log);
}

/**
 *  apply function
 *  Takes a CSS object and applies it to the current style.
 */
JSS.prototype.apply = JSS.apply = function(css) {
  JSS.log("Applying CSS: " + css);
    var style = document.createElement("style");
    $.each(css, function(index, cssLine) {
      style.appendChild(document.createTextNode(cssLine))
      JSS.log("Applied new style - index: " + index + ", cssLine: " + cssLine + "");
    })
    document.head.appendChild(style);

    if (($.inArray(style, this.srcCSS) === -1) && !_JSS_OVERRIDE_NO_REUSE)
      this.srcCSS.push(css)

}

$(document).ready(function() {
  JSS.init();
})
