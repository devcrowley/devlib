/**
 * devlib.mathtools.js 
 * Data parsing, generating, manipulating, and extending tools 
 * */

export class MathTools {

    /** Return a random number in a range */
    rndRange(min, max) {
        return (Math.random() * (max - min)) + min;
    }
    /** Return a random integer from <min> to <max> */
    rndRangeInt(min, max) {
        return Math.round((Math.random() * (max - min)) + min);
    }
    /** Return a random integer from 0 to <num> */
    rndInt(num) {
        num = num || 100000;
        return Math.round(Math.random() * num);
    }
    /** Convert Degrees to radians */
    degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    /** Gets the angle between two points, default is radians
    * @param {number} x1 Point #1 X coordinate
    * @param {number} y1 Point #1 Y coordinate
    * @param {number} x2 Point #2 X coordinate
    * @param {number} y2 Point #2 Y coordinate
    * @param {boolean} degrees Returns the angle in degrees
    */
    getAngle(x1, y1, x2, y2, degrees) {
        if(degrees) return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        return Math.atan2(y2 - y1, x2 - x1);
    }

 }

const mathTool = new MathTools();

export default mathTool;
