/** devlib.svgtools.js
 * Tools for manipulating SVGs
 */

 class SvgTool {
     constructor(element) {
        this.svgElement = element;
     }
     /** Sets an SVG element's transform origin point for scaling and rotating */
    setPivot(elem, pointName) {
        if(typeof elem === "string") elem = document.querySelector(elem);
        if(typeof pointName === "string") {
            pointName = document.querySelector(pointName);
        }
        
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
    }
    /** Retrieves the current center point of an SVG element */
    getCenter(elem) {
        const bbox = elem.getBBox();
        return [bbox.x + (bbox.width/2), bbox.y + (bbox.height/2)]
    }
 }

 function svgTool(element) {
     return new SvgTool(element);
 }

 export default svgTool;