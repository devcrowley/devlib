
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
export class DialogBox {
    constructor(options, devTool) {
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
        this.__render__();
    }
    __render__() {
        /** Quick access to document.createElement with assigning of classes and an ID 
         * @param [string] elemType : Type of element, such as "div" or "input"
         * @param [string] id : The element ID
         * @param [string] classes : A list of classes to add to the element, separated by spaces
         * @returns [object] : DOM Element
        */
        function addElement(elemType, classes, id) {
            const elem = document.createElement(elemType);
            let classList = [];
            if(id) elem.id = id;
            if(classes) {
                classList = classes.split(" ");
                classList.forEach(cls=>{
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
        if(typeof options.html === "object") {
            this.content.append(options.html);
        } else {
             this.content.innerHTML = options.html;
        }
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
        setupDragEvents(this);
    }

    /** Adds extra CSS stylings to the dialog box nodes if they don't exist already */
    applyStyles(styles) {
        const options = this.options;
        if(document.querySelector(".dialog-styles")) {
            document.querySelector(".dialog-styles").remove();
        }
        if(Number(options.width).toString() !== "NaN") options.width += "px";
        styles = styles || `
        .dialog-container {
            width: ${(options.width || "400px")};
            height: auto;
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
        .dialog-container * {
            box-sizing: border-box;
        }
        .dialog-container .dialog-title {
            display: block;
            background-color: rgb(0,30,60);
            color: white;
            font-size: 1.25rem;
            width: 100%;
            height: auto;
            padding: 5px;
            cursor: arrow;
            user-select:none;
        }
        .dialog-container .dialog-content {
            display: block;
            padding: 5px 5px 20px 5px;
            height: ${(options.height || "400px")};            
        }
        .dialog-container .dialog-closebtn {
            cursor: pointer;
            display: block;
            padding: 2px;
            float: right;
            margin-right: 2px;
            background-color: black; 
            color: white;
            height: 1.5rem            
        }
        .dialog-container .dialog-closebtn:hover {
            color:yellow;
            outline:1px solid yellow;
        }

        .dialog-container .dialog-buttonbar {
            position:absolute;
            width:100%;
            bottom:0px;
            text-align:right;
            height:2rem;
            background-color:rgba(0,100,200,0.15);
            padding:4px;
        }
        
        .dialog-container .dialog-buttonbar button {
            margin: 2px 5px 5px 5px;
        }              

        `;
        const style = document.createElement("style");
        this.style = style;
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

/** STILL IN DEVELOPMENT */
function setupDragEvents(container) {
    const titleBar = container.title;
    // titleBar
}

/** Converts data to HTML and returns it as a DIV element */
export function dataToHtml(data, options = {}) {
    // Covert the provided data to raw HTML
    const treeView = __dataToHtml(data, options);

    // Add expandability if the option is requested with options.container === true
    // Defaults
    options.list_element = options.list_element || "<li>";
    options.group_element = options.group_element || "<ul>";
    
    const __li_tag = options.list_element.split(">")[0].split(" ")[0].replace("<", "");
    const __ul_tag = options.group_element.split(">")[0].split(" ")[0].replace("<", "");
    
    // Prepare a DIV with the tree view HTML appended
    const div = document.createElement("div");
    if(options.title) div.innerHTML = options.title;
    div.innerHTML += treeView;
    div.classList.add("__data-tree-view");

    if(options.container) {
        document.querySelector(options.container).append(div);
    }
    if(options.expandable) {
        div.querySelectorAll(__li_tag).forEach(el=>{
            if(el.querySelector(__ul_tag)) {
                el.addEventListener("click", e=>{
                    e.stopPropagation();
                    e.target.classList.contains("__data-tree-view--collapsed") ? e.target.classList.remove("__data-tree-view--collapsed") : el.classList.add("__data-tree-view--collapsed");
                });
                el.classList.add("__data-tree-view--collapsed");
                el.classList.add("__data-tree-view--expandable");
            } else {
                el.classList.add("__data-tree-view--non-expandable");
                el.addEventListener("click", e=>{
                    e.stopPropagation();
                });                
            }
        });
    }
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
                if(typeof d === "object" && !Array.isArray(d)) {
                    options.noGroup = true;
                }
                returnHtml += __dataToHtml(d, options);
            });
            returnHtml += ul_closing;

        } else if(typeof data === "object") {
            // We're working with an object, so get its keys and values
            if(Object.keys(data).length === 0) return returnHtml;

            // If there's more than one element in this data, we want to group it
            if(!options.noGroup) returnHtml += ul;
            
            Object.keys(data).forEach(key=>{
                returnHtml += li;
                
                if(typeof data[key] === "string" || typeof data[key] === "number") {
                    returnHtml += '<span class="__data-tree-view--key">' + key + "</span>";
                    returnHtml += ' <span class="__data-tree-view--value">' + data[key] + "</span>";
                    returnHtml += li_closing;    
                    return returnHtml;
                }
                returnHtml += key;
                options.title = "";
                returnHtml += __dataToHtml(data[key], options);
                returnHtml += li_closing;
            });

            // Close the tag
            if(!options.noGroup) returnHtml += ul_closing;
            
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

export default DialogBox;