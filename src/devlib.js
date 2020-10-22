/** 
 * devlib.js
 * 
 * This file handles all imports for DevLib modules you require and passes them to the devQuery object.
 * Use the 'fn.myModule = myModule' syntax to add a sub-module/library to the DevLib object after
 * importing it with 'import.'  See the examples below.
 */


/** Main DevLib functionality */
import { fn, devQuery} from "./devlib.main.js";
/** Tools for manipulating and reading data from the current or remote URLs */
import urlTools from './devlib.urltools.js';
/** Tools for manipulating the DOM and its nodes */
import domTools from './devlib.domtools.js';
/** Data manipulation and generation tools */
import dataTools from './devlib.datatools.js';

fn.urlTools = urlTools;
fn.domTools = domTools;
fn.dataTools = dataTools;

export {
    fn,
    devQuery
}

export default devQuery;