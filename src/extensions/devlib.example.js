/** devlib.example.js
 * An example devQuery extension
 */

// This import line is required for all extensions
import { extend } from "../modules/devlib.devquery.js";

extend({
    example: function() {
        alert("The last query was " + this.__query);
    }
});
