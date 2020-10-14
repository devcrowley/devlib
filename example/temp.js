/** DevLib Examples
 * 
 */

import { $ } from "../src/devlib.js";

window.$ = $;
const app = {};
window.app = app;

$.ready(()=>{
    // window.dialog = $.domTools.dialogBox({
    //     title: "Devtools Examples",
    //     html: "<strong>A series of examples for DOM Queries, DOM Manipulation, UI, and other useful tools</strong><p>This portion is currently in development, so there isn't much here just yet.</p>",
    //     width: "300px",
    //     height: "auto"
    // })
    jsonToHtml();
});


/** Retrieves JSON data and places it into a tree view */
function jsonToHtml() {
    $.get("./exampledata.json").then(e=>{
        let data;
        data = JSON.parse(e);
        app.data = data;
        const treeView = dataToHtml(data, {
            title: "JSON Tree",
            list_element: '<li class="level{{index}}">',
            group_element: '<ul class="level{{index}}">',
            expandable: true,
            container: "body"
        });
    });
}

function dataToHtml(data, options) {
    const treeView = __dataToHtml(data, options);
    const div = document.createElement("div");
    div.innerHTML = treeView;
    document.querySelector(options.container).append(div);
    return div;


    function __dataToHtml(data, options = {}) {
        if(typeof options.index === "undefined") options.index = 0;
        if(typeof options.li_index === "undefined") options.li_index = 0;
        if(typeof options === "string") options = { title: options };
        options = JSON.parse(JSON.stringify(options));

        // Allow custom tags to replace ul and li elements.  Allow adding an index number to any value within the custom tag
        options.list_element = options.list_element || "<li>";
        options.group_element = options.group_element || "<ul>";

        const li = options.list_element.replace(/{{index}}/g, options.li_index);
        const ul = options.group_element.replace(/{{index}}/g, options.index);
        const li_closing = '</' + li.split(">")[0].split(" ")[0].replace("<", "") + ">";
        const ul_closing = '</' + ul.split(">")[0].split(" ")[0].replace("<", "") + ">";
        const title = options.title;
        options.index++;
        let returnHtml = "";
        if(Array.isArray(data)) {
            if(data.length === 0) return returnHtml;
            options.li_index ++;
            // We're working with an array.  Parse every element of the array.

            if(title) {
                returnHtml += `${ul}<span>${title || ""}</span>`;
            } else {
                returnHtml += ul;
            }

            
            data.forEach(d=>{
                options.title = "";
                returnHtml += __dataToHtml(d, options);
            });
            returnHtml += ul_closing;

        } else if(typeof data === "object") {
            // We're working with an object, so get its keys and values
            if(Object.keys(data).length === 0) return returnHtml;

            // If there's more than one element in this data, we want to group it
            if(Object.keys(data).length !== 1) {
                returnHtml += ul;
            } else {
            
            }
            
            Object.keys(data).forEach(key=>{
                returnHtml += li;
                returnHtml += key;
                if(typeof data[key] === "string" || typeof data[key] === "number") {
                    returnHtml += ": " + data[key];
                    returnHtml += li_closing;    
                    return returnHtml;
                }
                
                options.title = "";
                returnHtml += __dataToHtml(data[key], options);
                returnHtml += li_closing;
            });
            
            // Close the tag
            if(Object.keys(data).length !== 1) {
                returnHtml += ul_closing;
            }   
            
        } else if(typeof data !== "function") {
            // We're at the end of the line and dealing directly with text, so return it as the final value
            returnHtml = li + data.toString() + li_closing;
        } else {
            // Whatever data we received may be a function and can't be converted to a text value, so return nothing.
            return "";
        }
        return returnHtml;
    }
}

window.tree = dataToHtml;