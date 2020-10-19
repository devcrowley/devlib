/** Devlib 0.0.2a Modular Edition
 * This library is still in development!
 * 
 * A library with many useful functions
 * Uses ES6+ Syntax, so may not be compatible with older/obsolete browsers
 * 
 * Written by Devin Crowley, 2020
 * 
 * Note: In a non-modular import of this file, it may break jQuery if you use it.
 * This file does not require jQuery and doesn't support jQuery's '$' query selector.
 * If jQuery is pre-loaded in your app, this module will skip activation of the DevQuery class
 * to prevent conflicts.
 * 
 * Usage:  `import * as devlib from "./devlib.js";`
 */

/** Tools for manipulating and reading data from the current or remote URLs */
import urlTools from './devlib.urltools.js';
/** Tools for manipulating the DOM and its nodes */
import domTools from './devlib.domtools.js';

/** [In Development] A query and DOM manipulation library. */
class DevQuery {
    constructor(__query) {
        this.__query = __query;
        this.nodes = [];
    }
    /** Clears all values from the initial query */
    __clearValues__() {
        for (let i = 0; i < this.length; i++) {
            delete this[i];
        }
        this.length = 0;
        return (this);
    }
    /** Generates a new element from raw HTML, but doesn't append it to anything */
    __addElement__(node) {
        // Make sure a closing tag is provided or we'll get parsing errors
        const closingTag = "</" + node.split(" ")[0].split(">")[0].replace("<","") + ">";
        if(node.search(closingTag) === -1) node += closingTag;
        const newNode = new DOMParser().parseFromString(node, "text/xml");
        return newNode.firstChild;
    }
    /** Gets all of the query results and applies them to the query object */
    query(_query_) {
        // If _query_ has a value, we're probably trying to do a 'this.find()' operation
        if(_query_) return this.find(_query_);

        if(typeof this.__query !== "object") {
            // Query includes tags so create an element instead of querying for one
            if(this.__query.search(/[<>]/g) > -1) {
                const newElement = this.__addElement__(this.__query);
                const newDQ = new DevQuery(newElement);
                newDQ[0] = newElement;
                return newDQ;
            } else {
                const result = Array.from(document.querySelectorAll(this.__query));
                this.nodes = [];
                for (let i = 0; i < result.length; i++) {
                    this[i] = result[i];
                    this.nodes.push(this[i]);
                }
                this.length = result.length;
                return this;
            }
        } else {
            
            this.nodes = [this.__query];
            for(var i = 0; i < this.__query.length; i++) {
                this[i] = [this.__query][i];
            }
            return this;
        }
    }
    /** Appends a node or DOM element to queried element */
    append(node) {
        if(node.constructor.name === "DevQuery") {
            if(this[0]) {
                this[0].appendChild(node[0]);
                return this;
            }
        }
        else if(typeof node === "object") {
            if(this[0]) {
                this[0].append(node);
                return this;
            }
        } else {
            this[0].append(this.__addElement__(node));
            return this;
        }
    }
    /** Sets the value of all queried results */
    val(value) {
        if(value) {
            this.each(node=>node.value = value);
            return this;
        } else if(this[0]) {
            return this[0].value;
        } else {
            return false;
        }
    }
    /** Returns all queried results as an array */
    nodes_to_array() {
        const arr = [];
        for(let i = 0; i < this.length; i++) {
            arr.push(this[i]);
        }
        return arr;
    }
    /** Runs a function on each element in the queried results */
    each(fn) {
        const nodes = this.nodes;
        nodes.forEach(n=>{
            fn(n);
        });
        return this;
    }
    /** Sets an attribute value on all queried results */
    attr(attribute, value) {
        if(value) {
            this.each(el=>{
                el.setAttribute(attribute, value);
            })
            return this;
        } else if(this[0]) {
            console.log(this.__query);
            console.log(this[0]);
            return this[0].getAttribute(attribute);
        } else {
            return false;
        }
    }
    /** Sets an event for all queried results */
    on(evt, fn) {
        this.each(el=>{
            el.addEventListener(evt, fn);
        })        
    }
    /** Sets the HTML of the element */
    html(html) {
        if(typeof html === "undefined" && this[0]) return this[0].innerHTML;
        if(typeof html !== "undefined") {
            this.each(el=>{
                el.innerHTML = html;
            });
        }
        return false;
    }
    /** Runs a query selector on the first element of the existing DevQuery object */
    find(query) {
        if(!this[0]) return false;
        const devQuery = new DevQuery();
        devQuery.__query = "DevLib find";
        const retQuery = this[0].querySelectorAll(query);
        
        for(var i = 0; i < retQuery.length; i++) {
            devQuery[i] = retQuery[i];
            devQuery.nodes.push(retQuery[i]);
        }
        return devQuery;
    }
}

// --- Direct DevQuery Functions.  These don't require the 'new' operator ---

const fn = DevQuery.__proto__;

/**
 * Posts data to a given URL
 *
 * @param {string} url The URL to send data to
 * @param {string | object} data A string or object to post to the given URL
 * @param {function} callback Optional Callback function to run upon completion instead of utilizing the returned promise
 * @return {promise} Returns a promise which passes the data received from the URL upon error or completion
 */
fn.post = function (url, data, callback) {
    let promise = new Promise((resolve, reject) => {
        if(!url || !data) {
            reject("No URL Provided");
            callback({status: "error", data: "No URL Provided"});
        }
        var request = new XMLHttpRequest();
        request.open('post', url, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        // send the collected data as JSON
        request.send(JSON.stringify(data));

        request.onloadend = function(e) {
            resolve(e.target.response);
            if(callback) callback({status: "success", data: e.target.response});
        };    
        request.onerror = function(e) {
            reject(e.target.response);
            if(callback) callback({status: "error", data: e.target.response});
        };
    });
    return promise;
}

/**
 * Retrieves data from a given URL
 *
 * @param {string} url The URL to send data to
 * @param {function} callback Optional Callback function to run upon completion instead of utilizing the returned promise
 * @return {promise} Returns a promise which passes the data received from the URL upon error or completion
 */
fn.get = function(url, callback) {
    let promise = new Promise((resolve, reject) => {
        if(!url) {
            reject("No URL Provided");
            callback({status: "error", data: "No URL Provided"});
        }

        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.send();

        request.onloadend = function(e) {
            resolve(e.target.response);
            if(callback) callback(e.target.response);
        };    
        request.onerror = function(e) {
            reject(e.target.response);
            if(callback) callback(e.target.response);
        };
    });
    return promise;
}

/** Run a function after document completely finished loading */
fn.ready = function(callback) {
    document.addEventListener('DOMContentLoaded', callback);
}

/** Make sure we don't already have a query object such as jQuery.  If not, set up devQuery */
if (!$) var $ = (_$_) => {
    return new DevQuery(_$_).query();
}

fn.urlTools = urlTools;
fn.domTools = domTools;
/** Set exports for all functions by category */
export {
    urlTools,
    domTools,
    $
};

export default $;