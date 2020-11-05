/**
 * devlib.datetools.js 
 * Date manipulation and formatting
 * 
 * I was debating whether this should be a class or a library of functions since the 'new' operator
 * needs to be used for the class option.  I think it's best to have this as a class for now
 * so we can chain functions together.  Default export automatically uses the "new" operator when using
 * dateTool() and it returns a new DateTool object when used.  The DateTool class is also available
 * as its own export if you'd prefer to use the class directly
 * 
 * */

export class DateTool {
    constructor(date) {
        if(date) {
            this.date = new Date(date) ;
        } else {
            this.date = new Date();
        }
        this.timeZone = this.date.getTimezoneOffset() / 60;
        if(this.date.valueOf().toString().toLowerCase() == "nan") {
            console.error("Invalid date passed to DateTool.  Values will revert to the current date.");
            this.error = "Invalid Date";
            this.date = new Date();
        }
    }
    /** Adds days to the given date */
    addDays(days = 0) {
        this.date = new Date(this.date.valueOf()+(24*60*60*1000*days));
        return this;
    }
    /** Subtracts days to the given date */
    subDays(days = 0) {
        days*=-1;
        this.date = new Date(this.date.valueOf()+(24*60*60*1000*days));
        return this;
    }
    /** Formats a date to match the provided string.  Padded numbers start with a zero if they are single-digit.
     * ii -> padded Minutes
     * i -> minutes
     * HH -> 24 Hours, padded
     * H -> 24 Hours
     * hh -> 12 Hours, padded
     * h -> 12 Hours
     * ss -> padded seconds
     * s -> seconds
     * dd -> Padded numeric day of the month
     * d -> Numeric Day of the month
     * DD -> Full day name
     * D -> Partial day name (first 3 letters)
     * mm -> padded numeric month
     * m -> numeric month
     * M -> Partial month name (first 3 letters)
     * MM -> Full month name
     * a -> am/pm
     * A -> AM/PM
     * S -> Numeric suffix, i.e. 1st, 2nd, 3rd, ... 28th, 29th
     * Y -> Full 4-digit year
     * y -> 2-digit year
     * {any text in brackets} -> Text in brackets will remain unformatted
     */
    format(formatString) {
        const date = this.date;
        const days = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
        const months = "January February March April May June July August September October November December".split(" ");
        const dayFull = days[date.getDay()];
        const monthFull = months[date.getMonth()];
        const dayPartial = dayFull.substring(0,3);
        const monthPartial = monthFull.substring(0,3);
        const yearPartial = date.getFullYear().toString().substring(2,4);
        const hours12 = date.getHours() <= 12 ? date.getHours() : date.getHours() - 12;
        let am_pm = date.getHours() <= 12 ? "am" : "pm";
        let suffix = "";

        // Allow common characters to not be formatted when they are inside braces/brackets, i.e. "Y-mm-dd {at} hh:ii:ss"
        let matches = formatString.split('{')
            .filter(function(v){ return v.indexOf('}') > -1})
            .map( function(value) { 
            return value.split('}')[0]
        });

        let index = 0;
        while (formatString.search(/{([^{}]+)}/) > -1 && index < 100) {
          formatString = formatString.replace(/{([^{}]+)}/,"[[" + index + "]]");
          index++;
          if(index >= 99) {
              console.error("Returned too many results for formatted string bracket values");
          }
        }

        
        // Figure out the text suffix for a number
        const dayOfMonth = date.getDate();
        const lastNumber = Number(dayOfMonth.toString().charAt(dayOfMonth.toString().length-1));
        if(dayOfMonth >= 1 && dayOfMonth <= 3) {
            suffix = "st nd rd".split(" ")[lastNumber-1];
        }
        if(dayOfMonth >= 4 && dayOfMonth <= 20) {
            suffix = "th";
        }
        if(dayOfMonth >= 21 && lastNumber <= 3) {
            suffix = "st nd rd".split(" ")[lastNumber-1];
        }
        if(dayOfMonth >= 21 && (lastNumber >= 4 || lastNumber === 0)) {
            suffix = "th";
        }

        // Time and Date numeric conversions
        formatString = formatString
        .replace(/ii/g, (date.getMinutes()).toString().padStart(2,"0"))
        .replace(/i/g, date.getMinutes())
        .replace(/HH/g, (date.getHours()).toString().padStart(2,"0"))
        .replace(/H/g, date.getHours())
        .replace(/hh/g, hours12.toString().padStart(2,"0"))
        .replace(/h/g, hours12)
        .replace(/ss/g, (date.getSeconds()).toString().padStart(2,"0"))
        .replace(/s/g, date.getSeconds())
        .replace(/mm/g, (date.getMonth() + 1).toString().padStart(2,"0"))
        .replace(/m/g, date.getMonth() + 1)
        .replace(/yyyy/g, date.getFullYear())
        .replace(/Y/g, date.getFullYear())
        .replace(/y/g, yearPartial)
        .replace(/dd/g, date.getDate().toString().padStart(2,"0"))
        .replace(/d/g, date.getDate());

        // Day, Month, AM/PM String conversions: must come after numeric
        // conversions to prevent accidentally replacing text with numbers.
        // There's a catch here where if you replace the text once, it may screw up the
        // formatting formula, so we need to replace the elements with unique characters
        const encChars = {
            DD: "X1",   // Full day name
            D: "X2",    // Partial Day name
            MM: "X3",   // Full month name
            M: "X4",    // Partial month name
            a: "X5",    // Lowercase am/pm
            A: "X6",    // Uppercase AM/PM
            S: "X7"     // numeric letter suffix, i.e. 1st, 2nd, 3rd, etc.
        }
        formatString = formatString
        .replace(/DD/g, encChars.DD)
        .replace(/l/g, encChars.DD)
        .replace(/D/g, encChars.D)
        .replace(/MM/g, encChars.MM)
        .replace(/M/g, encChars.M)
        .replace(/F/g, encChars.MM)
        .replace(/a/g, encChars.a)
        .replace(/A/g, encChars.A)
        .replace(/S/g, encChars.S)

        // Now convert the coded characters into actual human-readable names
        .replace(/X1/g, dayFull)
        .replace(/X2/g, dayPartial)
        .replace(/X3/g, monthFull)
        .replace(/X4/g, monthPartial)
        .replace(/X5/g, am_pm)
        .replace(/X6/g, am_pm.toUpperCase())
        .replace(/X7/g, suffix);

        // Lastly, place any non-formatted text back into the formatString
        for(var i = 0; i < matches.length; i++) {
            formatString = formatString.replace("[["+ i + "]]", matches[i]);
        }

        return formatString;
    }
    valueOf(val) {
        if(val) {
            this.date.valueOf(val);
            return this;            
        } else {
            return this.date.valueOf();
        }
    }
    setDate(val) {
        if(val) {
            this.date = new Date(val);
            return this;            
        } else {
            return this.date.valueOf();
        }
    }
    getDate() {
        return this.date;
    }
    addHours(val) {
        this.date = new Date(this.date.valueOf()+((24+val)*60*60*1000));
        return this;     
    }
}

const dateTool = (date)=>{
    return new DateTool(date);
}

export default dateTool;