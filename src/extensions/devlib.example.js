/** devlib.example.js
 * An example devQuery extension
 */

function exampleExtension() {
    alert("The last query was " + this.__query);
}
export default exampleExtension;