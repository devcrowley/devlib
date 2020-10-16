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

export default urlTools;