/** Devlib 3.0.0a Modular Edition 
 * A library with many useful functions
 * Uses ES6+ Syntax, so may not be compatible with older/obsolete browsers
 * 
 * Note: In a non-modular import of this file, it may break jQuery if you use it.
 * This file does not require jQuery and doesn't support jQuery's '$' query selector.
 * 
 * Usage:  `import * as devlib from "./devlib.js";`
 */

/** Tools for manipulating and reading data from the current or remote URLs */
const urlTools = {};
/** Tools for manipulating the DOM and its nodes */
const domTools = {}; 

/** [In Development] A query and DOM manipulation library. */
class devQuery {
    constructor(__query, multiple) {
        this.__query = __query;
        this.__multiple = multiple || false;
    }
    /** Clears all values from the initial query */
    __clearValues__() {
        for (let i = 0; i < this.length; i++) {
            delete this[i];
        }
        this.length = 0;
        return (this);
    }
    /** Gets all of the query results and applies them to the query object */
    query() {
        const result = Array.from(document.querySelectorAll(this.__query));
        for (let i = 0; i < result.length; i++) {
            this[i] = result[i];
        }
        this.length = result.length;
        return this; //.__multiple ? result : result[0];
    }
    /** Appends a node or DOM element to queried element */
    append(node) {
        if(typeof node === "object") {
            if(this[0]) this[0].append(node);
        } else {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = node;
            const newNode = tempDiv.firstElementChild;
            tempDiv.remove();
            this[0].append(newNode);
            return this;
        }
    }
    /** Sets the value of all queried results */
    val(value) {
        this.each(node=>node.value = value);
        return this;
    }
    /** Returns all queried results as an array */
    nodes() {
        const arr = [];
        for(let i = 0; i < this.length; i++) {
            arr.push(this[i]);
        }
        return arr;
    }
    /** Runs a function on each element in the queried results */
    each(fn) {
        const nodes = this.nodes();
        nodes.forEach(n=>{
            fn(n);
        });
        return this;
    }
}

/** Make sure we don't already have a query object such as jQuery.  If not, set up devQuery */
if (!$) var $ = (_$_) => {
    return new devQuery(_$_).query();
}

/** Reads value pairs from an URL GET statement
 * For Example, parsing `http://myurl.html?value=yes&happy=youknowit`
 *
 *  to get all values after '?'
 * */
urlTools.getUrlDataValues = function() {
    if (window.location.href.search(/\?/g) === -1) return false;
    const gets = window.location.href.split("?")[1].split("&");
    const values = {};
    gets.forEach(g => {
        const _get = g.split("=");
        if (_get[1]) values[_get[0]] = _get[1];
    });
    return values;
}

/** Retrieves data from a URL and returns it as a promise resolve or as a callback 
 * @param {string} [url] - The URL in which to receive the data
 * @param {function} [callback] - An optional callback function to run after receiving a response from the URL
 * @param {boolean} [noCache] - Adds a query to the end of the URL to prevent receiving cached data
 */
urlTools.getDataFromURL = function(url, callback, noCache = false) {
    // Prevent loading a cached version of the requested file/path by appending a GET value
    if (noCache) url = url + "?nocache=1";
    let promise = new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (callback) callback(this.responseText);
                resolve(this.responseText);
            } else {

            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    });
    return promise;
}

/** Keep an element locked into another element's boundary
 * @param {string | object} elem A DOM query string DOM Node to keep within a container
 * @param {string | object} container A DOM query string DOM Node to stay constrained within
 * @param {number} padding Padding within the container to constrain the element
 */
domTools.keepObjectInBox = function(elem, container, padding) {
    var elemDims = {
        x: $(elem).offset().left,
        y: $(elem).offset().top,
        width: $(elem).width(),
        height: $(elem).height()
    };
    if ($(container).offset()) {
        var containerDims = {
            x: $(container).offset().left || 0,
            y: $(container).offset().top || 0,
            width: $(container).width(),
            height: $(container).height()
        };
    } else {
        var containerDims = {
            x: 0,
            y: 0,
            width: $(container).width(),
            height: $(container).height()
        };
    }
    elemDims.right = elemDims.x + elemDims.width;
    elemDims.bottom = elemDims.y + elemDims.height;
    containerDims.right = containerDims.x + containerDims.width;
    containerDims.bottom = containerDims.y + containerDims.height;


    if (elemDims.right > containerDims.right - padding) elemDims.x = containerDims.right - elemDims.width - padding;
    if (elemDims.x < containerDims.x + padding) elemDims.x = containerDims.x + padding;
    if (elemDims.bottom > containerDims.bottom - padding) elemDims.y = containerDims.bottom - elemDims.height - padding;
    if (elemDims.x < containerDims.x + padding) elemDims.x = containerDims.x + padding;

    $(elem).offset({
        left: elemDims.x,
        top: elemDims.y
    });
}


/** Set exports for all functions by category */
export {
    urlTools,
    domTools,
    $
};