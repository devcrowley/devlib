const urlTools = {};

/** Reads value pairs from an URL GET statement
 * For Example, parsing `http://myurl.html?value=yes&happy=youknowit`
 *
 *  to get all values after '?'
 * */
urlTools.getUrlDataValues = function() {
    if (window.location.href.search(/\?/g) === -1) return false;
    const gets = window.location.href.split("?")[1].split("&");
    const values = {};
    gets.forEach(g => {
        const _get = g.split("=");
        if (_get[1]) values[_get[0]] = _get[1];
    });
    return values;
}

/** Retrieves data from a URL and returns it as a promise resolve or as an optional callback 
 * @param {string} [url] - The URL in which to receive the data
 * @param {function} [callback] - An optional callback function to run after receiving a response from the URL
 * @param {boolean} [noCache] - Adds a query to the end of the URL to prevent receiving cached data
 */
urlTools.getDataFromURL = function(url, callback, noCache = false) {
    // Prevent loading a cached version of the requested file/path by appending a GET value
    if (noCache) url = url + "?nocache=1";
    let promise = new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Optionally use a callback instead of a promise upon completion
                if (callback) callback(this.responseText);
                resolve(this.responseText);
            } else {
                reject(this.responseText);
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    });
    return promise;
}

export default urlTools;