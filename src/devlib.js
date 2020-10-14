/** Devlib 3.0.0a INCOMPLETE Modular Edition
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
        if(typeof this.__query !== "object") {
            const result = Array.from(document.querySelectorAll(this.__query));
            this.nodes = [];
            for (let i = 0; i < result.length; i++) {
                this[i] = result[i];
                this.nodes.push(this[i]);
            }
            this.length = result.length;
            return this; //.__multiple ? result : result[0];
        } else {
            this.nodes = [this.__query];
            this[0] = [this.__query];
            return this;
        }
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