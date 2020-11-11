/** 
 * devlib.js
 * 
 * This file handles all imports for DevLib modules you require and passes them to the devQuery object.
 * Use the 'fn.myModule = myModule' syntax to add a sub-module/library to the DevLib object after
 * importing it with 'import.'  See the examples below.
 */


/** Main DevLib functionality */
import { fn, devQuery} from "./modules/devlib.main.js";
/** Tools for manipulating and reading data from the current or remote URLs */
import urlTools from './modules/devlib.urltools.js';
/** Tools for manipulating the DOM and its nodes */
import domTools from './modules/devlib.domtools.js';
/** Data manipulation and generation tools */
import dataTools from './modules/devlib.datatools.js';
/** Date manipulation and formatting tools */
import dateTool from './modules/devlib.datetools.js';

if(urlTools) fn.urlTools = urlTools;
if(domTools) fn.domTools = domTools;
if(dataTools) fn.dataTools = dataTools;
// The dateTool is a class and must be called with the 'new' syntax, i.e. `let date = new devQuery.DateTool`
if(dateTool) fn.dateTool = dateTool;

export {
    fn,
    devQuery
}

export default devQuery;