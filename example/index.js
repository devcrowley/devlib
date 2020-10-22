/** DevLib Examples
 * 
 */

import { devQuery as $ } from "../src/devlib.js";

window.$ = $;
const app = {};
window.app = app;

$.ready(()=>{
    $("#btn_showjsontree").on("click", e=>{
        jsonToHtml();
    });
    
});


/** Retrieves JSON data and places it into a tree view */
function jsonToHtml() {
    $.get("./exampledata.json").then(e=>{
        let data;
        data = JSON.parse(e);
        app.data = data;
        const treeView = $.domTools.dataToHtml(data, {
            title: "<h3>Click any Arrow Element to Expand It<h3>",
            list_element: '<li class="level{{index}}">',
            group_element: '<ul class="level{{index}}">',
            expandable: true,
        });
        const dialog = $.domTools.dialogBox({
            title: "JSON or Object to Tree View Example",
            html: treeView,
            width: "50%",
            height: "50vh"
        });
    });
}
