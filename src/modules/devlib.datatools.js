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

   /** Sorts any object by its key/value pairs and returns a sorted array containing each object element
    * @param {object} obj The object to sort
    * @param {boolean} descending Sort by descending order instead of ascending
    */
   
   sort(obj, descending) {
      const tmpAry = new Array();
      var i = 0;
      Object.keys(obj).forEach(key=>{
         if(obj[key]) {
            tmpAry[i] = new Array();
            tmpAry[i][1] = key;
            tmpAry[i][0] = (Number(obj[key]).toString() !== "NaN") ? obj[key].toString().padStart(10,"0") : obj[key];
            i++;
         }
      });
      tmpAry.sort();
      descending ? tmpAry.reverse() : tmpAry;
      let ob = {};
      const keyValuePairs = [];
      for (var i=0;i<tmpAry.length;i++) {
         ob[tmpAry[i][1]] = (Number(tmpAry[i][0]).toString() !== "NaN") ? Number(tmpAry[i][0]) : tmpAry[i][0];
         keyValuePairs.push(ob);
         ob={};
      }
      return keyValuePairs;
   }    
 }

const dataTool = new DataTools();

export default dataTool;