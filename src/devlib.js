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
const urlTools = {};
/** Tools for manipulating the DOM and its nodes */
const domTools = {}; 

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
const fn = DevQuery.__proto__;
fn.post = function(url, data, callback) {
    if(!url) return false;
    if(!data) return false;

    var request = new XMLHttpRequest();
    request.open('post', url, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    request.send(JSON.stringify(data));

    request.onloadend = function(e) {
        if(callback) callback({status: "success", data: e.target.response});
    };    
    request.onerror = function(e) {
        if(callback) callback({status: "error", data: e.target.response});
    };
}

/** Make sure we don't already have a query object such as jQuery.  If not, set up devQuery */
if (!$) var $ = (_$_) => {
    return new DevQuery(_$_).query();
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

/** A Raw javascript & HTML dialog generator.  Doesn't require any frameworks. 
* EXAMPLE:
```javascript
const dialog = new DialogBox({
        title: "A Sample Dialog",
        html: "You can put any html here that you would like!", 
        width: "400px",
        height: "400px",
        buttons: [
            { Cancel: (dlog)=>dlog.remove() },
            { Save: (dlog)=>console.log("Save a file!") }
        ]
});
 ```
*/
class DialogBox {
    constructor(options) {
        options = options || {};
        const $this = this;
        this.html = options.html || "";
        this.title = options.title || "";
        this.buttons = options.buttons || [{
            "Close": ()=> {
                $this.remove();
            }
        }];
        this.options = options;
        this.render();
    }
    render() {
        /** Quick access to document.createElement with assigning of classes and an ID 
         * @param [string] elemType : Type of element, such as "div" or "input"
         * @param [string] id : The element ID
         * @param [string] classes : A list of classes to add to the element, separated by spaces
         * @returns [object] : DOM Element
        */
        function addElement(elemType, id, classes) {
            const elem = document.createElement(elemType);
            let classList = [];
            if(id) elem.id = id;
            if(classes) {
                classList = classes.split(" ");
                classList.forEach(cls=>{
                    console.log(cls);
                    elem.classList.add(cls);
                })
            }
            return elem;
        }        

        const $this = this;
        this.container = addElement("div", "dialog-container");
        this.title = addElement("div", "dialog-title");
        this.content = addElement("div", "dialog-content");
        this.closeButton = addElement("div", "dialog-closebtn");
        this.buttonBar = addElement("div", "dialog-buttonbar");
        
        const options = this.options;
        this.content.innerHTML = options.html;
        this.closeButton.innerHTML = "X";
        this.title.innerHTML = options.title;
        this.title.append(this.closeButton);
        this.container.append(this.title);
        this.container.append(this.content);
        this.container.append(this.buttonBar);
        this.applyStyles();
        document.body.append(this.container);

        /** Add button events */
        this.closeButton.addEventListener("click",()=>{
            $this.remove();
        });
        this.buttons.forEach(btn=>{
            const newButton = document.createElement("button");
            newButton.innerHTML = Object.keys(btn)[0];
            this.buttonBar.append(newButton);
            newButton.addEventListener("click", ()=>btn[Object.keys(btn)[0]]($this));
        });
    }

    /** Adds extra stylings to the dialog box nodes if they don't exist already */
    applyStyles() {
        const options = this.options;
        if(document.querySelector("#dialog-styles")) {
            document.querySelector("#dialog-styles").remove();
        }
        if(Number(options.width).toString() !== "NaN") options.width += "px";
        const styles = `
        #dialog-container {
            width: ${(options.width || "400px")};
            height: ${(options.height || "400px")};
            background-color: ${(options.backgroundColor || "white")};
            color: ${(options.color || "black")};
            font-size: ${(options.fontSize || "1rem")};
            font-family: ${(options.fontFamily || "Arial, sans-serif")};
            display: block;
            position: absolute;
            transform: translate(-50%, -50%);
            top: 50%;
            left: 50%;
            box-sizing: border-box;
            border:1px solid black;
            border-radius:5px;
            box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.5);
        }
        #dialog-container * {
            box-sizing: border-box;
        }
        #dialog-container #dialog-title {
            display: block;
            background-color: rgb(0,30,60);
            color: white;
            font-size: 1.25rem;
            width: 100%;
            height: auto;
            padding: 5px;
        }
        #dialog-container #dialog-content {
            display: block;
            padding: 5px;
            height:100%;
        }
        #dialog-container #dialog-closebtn {
            cursor: pointer;
            display: block;
            padding: 2px;
            float: right;
            margin-right: 2px;
            background-color: black; 
            color: white;
            height: 1.5rem            
        }
        #dialog-container #dialog-closebtn:hover {
            color:yellow;
            outline:1px solid yellow;
        }

        #dialog-container #dialog-buttonbar {
            position:absolute;
            width:100%;
            bottom:0px;
            text-align:right;
            height:2rem;
            background-color:rgba(0,100,200,0.15);
            padding:4px;
        }
        
        #dialog-container #dialog-buttonbar button {
            margin: 2px 5px 5px 5px;
        }              

        `;
        const style = document.createElement("style");
        style.id = "dialog-styles";
        style.innerHTML = styles;
        this.container.append(style);
    }
    /** Hides the dialog box but keeps it in memory */
    hide() { 
        this.container.style.display = "none";
        console.log("HIde me");
    }
    /** Shows a hidden dialog box.  Will not work for dialogs that have been removed */
    show() { 
        this.container.style.display = "block";
    }
    /** Appends a DOM Node to the content area */
    append(elem) {
        this.content.append(elem);
    }
    /** Changes the box title */
    title(html) {
        this.title.innerHTML = options.title = html;
    }
    /** Changes the box content */
    html(html) {
        this.content.innerHTML = options.html = html;
    }
    /** Removes the dialog box from the DOM and sets up the Dialog Box object for deletion */
    remove() {
        // Memory cleanup
        this.container.remove();
        Object.keys(this).forEach(key=>{
            this[key] = null;
            delete this[key];
        })

        // This most likely won't do anything.  Dialog may remain in memory until its associated variable is nullified
        delete this;   
    }

}

domTools.dialogBox = function(options){ return new DialogBox(options); } 
fn.urlTools = urlTools;
fn.domTools = domTools;
/** Set exports for all functions by category */
export {
    urlTools,
    domTools,
    $
};