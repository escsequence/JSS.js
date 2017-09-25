/**
 * CSS-JSON Converter for JavaScript
 * Converts CSS to JSON and back.
 * Version 2.1
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !! This is a minified version of this library. !!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 *  Released under the MIT license.
 *  You can guess the MIT license, just look it up.
 *
 *  Copyright (c) 2013 Aram Kocharyan, http://aramk.com/
 */

var CSSJSON = new function () {

    var base = this;

    /**
      This function was coded by James Johnston
      Purpose: convert an actual JSON object to
      whatever they are using.......................
      Goal is to make a function that will replace toCSS and use real
      JSON objects, so anyone can convert anything in real-time.
    **/
    base.convertJSON = function(json) {
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
        cssNodes.push(base.toCSS(node));
      })
      return cssNodes;
    }

    /**
     * @param node
     *            A JSON node.
     * @param depth
     *            The depth of the current node; used for indentation and
     *            optional.
     * @param breaks
     *            Whether to add line breaks in the output.
     */
    base.toCSS = function (node, depth, breaks) {
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

    var strAttr = function (name, value, depth) {
        return '\t'.repeat(depth) + name + ': ' + value + ';\n';
    };

    var strNode = function (name, value, depth) {
        var cssString = '\t'.repeat(depth) + name + ' {\n';
        cssString += base.toCSS(value, depth + 1);
        cssString += '\t'.repeat(depth) + '}\n';
        return cssString;
    };

};
