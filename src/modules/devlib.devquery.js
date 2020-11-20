/** Devlib 0.0.3a Modular Edition
 * This library is still in development!
 * 
 * A library with many useful functions
 * Uses ES6+ Syntax, so may not be compatible with older/obsolete browsers
 * 
 * Written by Devin Crowley, 2020
 * 
 * Example DevLib Usage:  `import * as devlib from "./devlib/devlib.js";`
 * Example DevQuery Usage: import { devQuery as $ } from "./devlib/devlib.js"
 * 
 * Developer note:  I'm slowly going through each `for` loop and replacing
 * it with a `while` loop instead.  After reviewing performance of different
 * loop types, for large datasets, `while` always wins outright.  For small
 * datasets, standard `for` loops are faster, but we can't assume dataset
 * size, so choose the best option!  See `arrEach(arr,fn)` for the function
 * we're using for these loops.  It's in the 'private functions' section of this
 * module.
 */

/** [In Development] A query and DOM manipulation library. */

function devQuery(_$_) {
    return new DevQuery(_$_).query();
}

export class DevQuery {
    constructor(__query) {
        if(!__query) {
            __query = "";
        }
        this.__query = __query;
        this.nodes = [];
        this.length = 0;
    }
    /** Clears all values from the initial query */
    __clearQuery__() {
        for (let i = 0; i < this.length; i++) {
            delete this[i];
        }
        this.length = 0;
        return (this);
    }
    /** Generates a new element from raw HTML, but doesn't append it to anything */
    __addElement__(nodeHtml) {
        nodeHtml = nodeHtml.trim();
        // Make sure a closing tag is provided or we'll get parsing errors
        const closingTag = "</" + nodeHtml.split(" ")[0].split(">")[0].replace("<","") + ">";
        const openingTag = closingTag.replace("/","");
        const elementName = openingTag.replace("<","").replace(">","");
        if(nodeHtml.search(closingTag) === -1) nodeHtml += closingTag;

        // Table elements can't be appended outside of an actual table, so let's check
        // if we're dealing with table elements or not.  If so, we have to do something
        // a little different to obtain a new td or tr node.
        if(openingTag === "<td>" || openingTag === "<tr>") {
            const docFragment = document.createElement("table");
            docFragment.innerHTML = nodeHtml;
            const newNode = docFragment.querySelector(elementName);
            return newNode;
        } else {
            // We're creating a non-table element.  We have to use this instead of the table
            // element code since the HTML will NOT re-render the above code outside of a table
            const container = document.createElement("div");
            container.insertAdjacentHTML("afterBegin", nodeHtml);
            const newNode = container.firstChild.cloneNode(true);
            return newNode;
        }
    }
    /** Appends a node or newly generated DOM element via text at the given position inside/outside the queried element */
    __appendAt__(node, location) {
        if(!node) return this;
        
        if(node.constructor.name === "DevQuery") {
            if(this[0]) {
                this[0].insertAdjacentElement(location, node[0]);
                return this;
            }
        }
        else if(typeof node === "object") {
            if(this[0]) {
                this[0].insertAdjacentElement(location, node);
                return this;
            }
        } else {
            // If we're appending an element via an HTML string, we can add this
            // element to all queried nodes instead of just the first
            this.each(el=>{
                el.insertAdjacentElement(location, this.__addElement__(node));
            });
            return this;
        }          
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
                newDQ.nodes.push(newElement);
                newDQ.length = 1;
                return newDQ;
            } else {
                const result = Array.from(document.querySelectorAll(this.__query));
                this.nodes = [];
                arrEach(result, (el, index)=>{
                    this[index] = el;
                    this.nodes.push(this[index]);   
                });

                this.length = result.length;
                return this;
            }
        } else {
            this.nodes = [this.__query];
            this.length = 1;
            this[0] = this.__query;
            return this;
        }
    }
    /** Appends a node or newly generated DOM element via text to the queried element */
    append(node) {
        this.__appendAt__(node, "beforeEnd");
        return this;
    }
    /** Adds a node or newly generated DOM element BEFORE all other child elements within the queried element */
    prepend(node) {
        this.__appendAt__(node, "afterBegin");
        return this;  
    }    
    /** Appends a node or newly generated DOM element via text BEFORE the queried element */
    before(node) {
        this.__appendAt__(node, "beforeBegin");
        return this;  
    }
    /** Appends a node or newly generated DOM element via text AFTER the queried element */
    after(node) {
        this.__appendAt__(node, "afterEnd");
        return this;
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
    /** Runs a function on each element in the queried results */
    each(fn) {
        const nodes = this.nodes;
        let i = 0;
        while(i < nodes.length) {
            fn(nodes[i]);
            i++;
        }         
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
            return this;
        }
    }
    /** Sets an event for all queried results */
    on(evt, fn) {
        this.each(el=>{
            el.addEventListener(evt, fn);
        });
        return this;
    }
    /** Removes elements from the DOM */
    remove() {
        this.each(el=>{
            el.remove();
        });
        return this;
    }    
    /** Sets the HTML of the element */
    html(html) {
        if(typeof html === "undefined" && this[0]) return this[0].innerHTML;
        if(typeof html !== "undefined") {
            this.each(el=>{
                el.innerHTML = html;
            });
            return this;
        }
        return this;
    }
    /** Runs a query selector on the first element of the existing DevQuery object */
    find(query) {
        if(!this[0]) return this;
        const devQuery = new DevQuery();
        devQuery.__query = "DevLib find";
        const retQuery = this[0].querySelectorAll(query);
        
        for(var i = 0; i < retQuery.length; i++) {
            devQuery[i] = retQuery[i];
            devQuery.nodes.push(retQuery[i]);
        }
        devQuery.length = devQuery.nodes.length;
        return devQuery;
    }
    /** Returns the first value in a DevQuery as its own DevQuery object */
    first() {
        if(!this[0]) return this;
        const devQuery = new DevQuery();
        devQuery.__query = "DevLib first";
        devQuery[0] = this[0];
        devQuery.nodes.push(this[0]);
        devQuery.length = devQuery.nodes.length;
        return devQuery;
    }
    /** Returns the last value in a DevQuery as its own DevQuery object */
    last() {
        if(!this[0]) return this;
        const [lastItem] = this.nodes.slice(-1);
        const devQuery = new DevQuery();
        devQuery.__query = "DevLib last";
        devQuery[0] = lastItem;
        devQuery.nodes.push(lastItem);
        devQuery.length = devQuery.nodes.length;
        return devQuery;
    }
    /** Gets the parent elements of all queried nodes and returns it as a single DevQuery object */
    parent() {
        if(!this.length) {
            return this;
        }
        const retQuery = new DevQuery();
        retQuery.__query = "DevLib parent";
        for(var i = 0; i < this.length; i++) {
            retQuery[i] = this[i].parentElement;
            retQuery.nodes.push(this[i].parentElement);
        }
        retQuery.length = retQuery.nodes.length;
        return retQuery;
    }
    /** Gets or sets the dataContains value for all elements */
    data(data, value) {
        if(typeof value === "undefined" && this[0]) return this[0].dataset[data];
        if(typeof value !== "undefined") {
            this.each(el=>{
                el.dataset[data] = value;
            });
            return this;
        }
    }
    /** Hides an element */
    hide() {
        this.each(el=>{
            if(el.style.display && el.style.display !== "none") el.dataset.__display__ = el.style.display;
            el.style.display = "none";
        });     
        return this;   
    }
    /** Shows an element that was hidden via style.display="none" or hide() */
    show() {
        this.each(el=>{
            if(el.dataset.__display__) { 
                el.style.display = el.dataset.__display__;
                delete el.dataset.__display__;
            } else {
                el.style.display = "block";
            }
        });
        return this;
    }
    /** Removes all child elements from the query */
    empty() {
        this.each(el=>{
            arrEach(el.childNodes,e=>{
                e.remove();
            });
        });
        return this;        
    }
    /** Adds a string of classes to the queried elements */
    addClass(classes) {
        this.each(el=>{
            arrEach(classes.split(" "),c=>{
                el.classList.add(c);
            });
        });
        return this;        
    }
    /** Removes a string of classes from the queried elements */
    removeClass(classes) {
        this.each(el=>{
            arrEach(classes.split(" "),c=>{
                el.classList.remove(c);
            });
        });
        return this;        
    }
    /** Toggles a string of classes from the queried elements */
    toggleClass(classes) {
        this.each(el=>{
            arrEach(classes.split(" "),c=>{
                if(el.classList.contains(c)) {
                    el.classList.remove(c);
                } else {
                    el.classList.add(c);
                }
            });
        });
        return this;        
    }        
    /** Moves an element to the given offset */
    offset(x,y) {
        this.each(el=>{
            el.style.position = "absolute";
            el.style.left = x + "px";
            el.style.top = y + "px";
        });
        return this;                
    }
    /** Sets style or full CSS for an element */
    css(style, val) {
        if(val) {
            this.each(el=>{
                el.style[style] = val;
            });
            return this;               
        } else {
            el.style.cssText = style;
        }
    }

    // --- Quick access to mouse events ---
    /** Quick access to the onClick event */
    click(fn) {
        this.on("click", fn);
        return this;          
    }
    /** Quick access to the mousemove event */
    mousemove(fn) {
        this.on("mousemove", fn);
        return this;          
    } 
    /** Quick access to the mousemove event */
    mouseover(fn) {
        this.on("mouseover", fn);
        return this;          
    } 
    /** Quick access to the mouseout event */
    mouseout(fn) {
        this.on("mouseout", fn);
        return this;          
    }
/** Sorts the items in a select dropdown so they're in alphabetical/numerical order 
 * @param {bool} descending Sets the order to descending instead of ascending
*/
    sort(descending) {
        const tmpAry = new Array();
        this.each(selElem=>{
            for (var i=0;i<selElem.options.length;i++) {
                tmpAry[i] = new Array();
                tmpAry[i][0] = selElem.options[i].text;
                tmpAry[i][1] = selElem.options[i].value;
            }
            tmpAry.sort();
            descending ? tmpAry.reverse() : tmpAry;
            while (selElem.options.length > 0) {
                selElem.options[0] = null;
            }
            for (var i=0;i<tmpAry.length;i++) {
                var op = new Option(tmpAry[i][0], tmpAry[i][1]);
                selElem.options[i] = op;
            }
            return;
        });
    }
}

// Private functions
/** Iterates through an array and runs a function on each element.  This is a performance 
 * boost over `for ... ` and `forEach` loops for large datasets.  Not used much at this time,
 * but may be handy as the DevLib modules expand.
*/
function arrEach(arr,fn) {
    arr = Array.from(arr);
    if(!Array.isArray(arr)) {
        console.warn("Cannot iterate through a non-array element!");
        return false;
    }
    if(typeof fn != "function") {
        console.warn("arrEach requires a function in the second argument!");
        return false;
    }    
    let i = 0;
    while(i < arr.length) {
        fn(arr[i], i);
        i++;
    }    
    return arr;
}

// --- Extends the DevQuery functionality
const fn = DevQuery.prototype;


// --- Direct pure functions for devQuery

/**
 * Posts data to a given URL
 *
 * @param {string} url The URL to send data to
 * @param {string | object} data A string or object to post to the given URL
 * @param {function} callback Optional Callback function to run upon completion instead of utilizing the returned promise
 * @return {promise} Returns a promise which passes the data received from the URL upon error or completion
 */
devQuery.post = function (url, data, callback) {
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
devQuery.get = function(url, callback) {
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
devQuery.ready = function(callback) {
    document.addEventListener('DOMContentLoaded', callback);
}

// fn.urlTools = urlTools;
// fn.domTools = domTools;

/** Set exports for all functions by category */
export {
    devQuery,
    fn
};

export default devQuery;