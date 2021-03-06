/** 
 * devlib.js
 * 
 * This file handles all imports for DevLib modules you require and passes them to the devQuery object.
 * Use the 'fn.myModule = myModule' syntax to add a sub-module/library to the DevLib object after
 * importing it with 'import.'  See the examples below.
 */

// Stand-alone modules

/** Main DevLib functionality */
import { fn, DevQuery, devQuery} from "./modules/devlib.devquery.js";
/** Tools for manipulating and reading data from the current or remote URLs */
import urlTool from './modules/devlib.urltools.js';
/** Tools for manipulating the DOM and its nodes */
import domTool from './modules/devlib.domtools.js';
/** Data manipulation and generation tools */
import dataTool from './modules/devlib.datatools.js';
/** Date manipulation and formatting tools */
import dateTool from './modules/devlib.datetools.js';
/** Math tools */
import mathTool from './modules/devlib.mathtools.js';

// ---- DevQuery Extendable modules ---- //

/** A very simple example extension */
import './extensions/devlib.example.js';
/** Tools for working with SVGs, such as pivot points and manipulation */
import './extensions/devlib.svgtools.js';


/* 
Direct export access to modules in case we don't want to use devQuery.
Note that modules included in this list should not require devQuery 
to be active at any time since the user may have excluded it from being loaded.  
While these modules are attached to the devQuery object for easy access,
they should still be able to be used without devQuery itself
*/
if(devQuery) {
    if(urlTool) devQuery.urlTool = urlTool;
    if(domTool) devQuery.domTool = domTool;
    if(dataTool) devQuery.dataTool = dataTool;
    if(dateTool) devQuery.dateTool = dateTool;
    if(mathTool) devQuery.mathTool = mathTool;
}

export {
    fn,
    devQuery,
    DevQuery,
    urlTool,
    domTool,
    dataTool,
    dateTool,
    mathTool,
}

export default devQuery;