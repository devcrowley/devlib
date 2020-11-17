/** 
 * devlib.js
 * 
 * This file handles all imports for DevLib modules you require and passes them to the devQuery object.
 * Use the 'fn.myModule = myModule' syntax to add a sub-module/library to the DevLib object after
 * importing it with 'import.'  See the examples below.
 */


/** Main DevLib functionality */
import { DevQuery, fn, devQuery} from "./modules/devlib.main.js";
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

if(urlTool) devQuery.urlTool = urlTool;
if(domTool) devQuery.domTool = domTool;
if(dataTool) devQuery.dataTool = dataTool;
if(dateTool) devQuery.dateTool = dateTool;
if(mathTool) devQuery.mathTool = mathTool;

export {
    fn,
    devQuery,
    DevQuery
}

export default devQuery;