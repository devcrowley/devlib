import { DialogBox, dataToHtml } from './devlib.ui.js';
const domTools = {}; 

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

domTools.dialogBox = function(options){ return new DialogBox(options); } 
domTools.dataToHtml = dataToHtml;

export default domTools;
