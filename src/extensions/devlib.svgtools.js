/** devlib.svgtools.js
 * Extends the DevQuery class
 * Tools for manipulating SVGs
 */

// This import line is required for all extensions
import { extend, devQuery } from "../modules/devlib.devquery.js";

extend({
    /** Sets the pivot point of an SVG element */
    setPivot: function(pointName) {
        this.each(elem=>{
            const bbox = elem.getBBox();
            if(Array.isArray(pointName)) {
                elem.setAttribute("transform-origin", `${pointName[0]} ${pointName[1]}`);
            }
            if(pointName === "center") {
                elem.setAttribute("transform-origin", `${bbox.x + (bbox.width/2)} ${bbox.y + (bbox.height/2)}`);
            }
            if(pointName === "topcenter") {
                elem.setAttribute("transform-origin", `${bbox.x + (bbox.width/2)} ${bbox.y}`);
            }
            if(pointName === "bottomcenter") {
                elem.setAttribute("transform-origin", `${bbox.x + (bbox.width/2)} ${bbox.y + bbox.height}`);
            }        
            if(pointName === "leftcenter") {
                elem.setAttribute("transform-origin", `${bbox.x} ${bbox.y + (bbox.height/2)}`);
            }   
            if(pointName === "rightcenter") {
                elem.setAttribute("transform-origin", `${bbox.x + bbox.width} ${bbox.y + (bbox.height/2)}`);
            }     
            if(pointName === "topleft") {
                elem.setAttribute("transform-origin", `${bbox.x} ${bbox.y}`);
            }
            if(pointName === "topright") {
                elem.setAttribute("transform-origin", `${bbox.x + bbox.width} ${bbox.y}`);
            } 
            if(pointName === "bottomleft") {
                elem.setAttribute("transform-origin", `${bbox.x} ${bbox.y + bbox.height}`);
            }
            if(pointName === "bottomright") {
                elem.setAttribute("transform-origin", `${bbox.x + bbox.width} ${bbox.y + bbox.height}`);
            } 
            return elem;  
        });
    },
    /** Retrieves the current center point of an SVG element */
    getCenter: function() {
        const bbox = this[0].getBBox();
        return [bbox.x + (bbox.width/2), bbox.y + (bbox.height/2)]
    },
    /** Loads an SVG from file and adds it to the queried elements */
    loadSVG: function(url) {
        const $this = this;
        let promise = new Promise((resolve, reject) => {
            devQuery.get(url).then(data=>{
                data = data.replace(/\r/g,"").replace(/\n/g,"").replace(`<?xml version="1.0" encoding="UTF-8" standalone="no"?>`,"");
                $this.html(data);
                resolve($this);
            });
        });
        return promise;
    },
    /**
     * Downloads an SVG file as an image file
     * @param {string} filename File Name without extension
     * @param {number} scale Scale multiplier
     * @param {number} padding Number of empty pixels to add around the image
     */
    downloadAsImage: function(filename, filetype = "png", scale = 4, padding = 10) {
        svgToFile(this, filename, filetype, scale, padding);
    },
    downloadAsSVG: function(filename) {
        svgToFile(this, filename, "svg",1,0);
    },

});

/** 
 * Convert a file to base64 for use within svg xlink:href="xxx"
 * @param {string} [filepath] - URL path to the file to convert
 * @callback [callback] - Callback function to run after completion
*/
function convertToBase64(filepath, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        if(callback) callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', filepath);
    xhr.responseType = 'blob';
    xhr.send();
}

/** 
 * Converts SVG image elements to base64 for export to canvas/JPEG
 * @callback [callback] - Callback function to run upon completion
*/
function switchSvgImagesToBase64(images, callback) {
    // Get all elements that include an xlink:xref and switch their sources
    let imageCount = images.length; // Let's make sure we do a callback after all images are successfully converted.
    let imageIndex = 0;
    if(imageCount === 0) {
        callback();
        return;
    }
    images.forEach(img=>{
        let filepath = img.getAttribute("xlink:href");
        convertToBase64(filepath, result=>{
            img.setAttribute("xlink:href", result);
            imageIndex++;
            if(imageIndex >= imageCount) callback();
        });
    });
}

/** 
 * Converts an SVG to other image types for downloading
 * @param {string} [fileType] - Filetype to download as {jpg, svg, csec}
 * @param {number} [scale] - JPEG Only - Image output scale
 * @param {number} [padding] - JPEG Only - Padded area around the rendered SVG File
*/
function svgToFile(source, filename = "download", fileType = "png", scale = 4, padding = 10) {
    
    
    switchSvgImagesToBase64(source.find("image").nodes,()=>{
        // Let's not tweak the main SVG file.  Let's clone it and change its image sources instead.
        const svgSource = source[0];
        let svg = svgSource.cloneNode(true);
        let bounds = svgSource.getBoundingClientRect();
        let width = bounds.width * scale;
        let height = bounds.height * scale;
        if(fileType !== "svg") svg.width.baseVal.valueInSpecifiedUnits  = width;
        
        // Prepare and Convert SVG to base 64 to be used in an image tag
        let serializedSVG = new XMLSerializer().serializeToString(svg);
        let base64Data = window.btoa(serializedSVG);

        if(fileType !== "svg") {
            saveSvgAsJpeg(filename, fileType, base64Data, svg, width, height, scale, padding);
        }
        if(fileType === "svg") {
            let link = document.createElement('a');
            link.download = filename + '.svg';
            link.href = "data:image/svg+xml;base64," + base64Data;
            link.click();
            link.remove();
            svg.remove();
        }
    });
}

/** 
 * Converts an SVG to JPEG: Recommend that you use the svgToFile function instead as it utilizes this function properly
 * @param {string} filename File name without the file extension
 * @param {string} fileType File extension
 * @param {string} [base64Data] - Serialized base64 encoded SVG File
 * @param {node} [svg] - SVG Node used to generate the JPEG
 * @param {number} [width] - JPEG Width
 * @param {number} [height] - JPEG Width
 * @param {number} [scale] - Image output scale
 * @param {number} [padding] - Padded area around the rendered SVG File
*/
function saveSvgAsJpeg(filename, fileType, base64Data, svg, width, height, scale = 4, padding = 10) {
    // Prepare a canvas
    let mimeType = "";
    fileType === "jpg" ? mimeType = "jpeg" : mimeType = fileType; 
    let canvas = document.createElement('canvas');
    canvas.width = width + (padding * scale);
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        var link = document.createElement('a');
        link.download = filename + "." + fileType;
        link.href = canvas.toDataURL("image/" + mimeType);
        link.click();
        link.remove();
        canvas.remove();
        img.remove();
        svg.remove();
    }
    img.src = "data:image/svg+xml;base64," + base64Data;    
}

