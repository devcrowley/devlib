/**
 * devlib.datatools.js 
 * Data parsing, generating, manipulating, and extending tools 
 * */

 class DataTools {

    /** Generates a long unique identifier 
     * @param {string} formatString: An optional UID format replacing 'x' as a UID character, default is `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
    */
     generateUid(formatString = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx') {
        return formatString.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
    }
 }

const dataTools = new DataTools();

export default dataTools;