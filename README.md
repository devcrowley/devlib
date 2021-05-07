# DevLib v0.1a

This library is no longer in development but is fully functional.  It was a learning experiment in re-creating smaller footprint version of a jQuery-like library with a hint of Vue/React-like component and stateful templates.  I'm keeping it available so others can learn from the comments throughout the code.  Note that it doesn't always follow best practices as it was developed earlier in my development path.

## DevQuery

The DevQuery object is a bit like a jQuery-Lite for ES6+.  It is much smaller but lacks some functionality that you may find in jQuery.  New function are added to it often.

To import the devQuery library as '$', use:

```javascript
import { devQuery as $ } from "./js/devlib.js";
```

### Available Functions in v0.1a

* These instructions are assuming devQuery is defined as `$`.  Replace `$` with your custom variable name as needed.

#### Queries

`$(query)` Queries may be text elements, DOM elements, or other Dev Queries, i.e. `$("body")` would return a DevQuery object containing the body element.

New DOM elements can be created by including tags in your query.  For example:
`$("<div>This is a new div</div>)` would return a DevQuery object containing a new DIV element as its first value.  This element is retained in memory but is not appended to any elements and must be appended manually.

You may also append new elements with the `.append` function.  For example:
`$("body").append('<div>This is a new DIV</div>');`

#### Query Functions

*New functions are being added often*

`$(".myquery").functionName`

* `append(query)` Appends an element to the first result in a query.
* `attr("key", [optional value])` Gets or sets an attribute value.  If no value is passed, it will return the value of the attribute.  If a value is provided, it will set that value for the attribute.
* `each(func)` Runs a function on each element in the query.
* `find(string)` Finds all elements of a given query within the current query.  Returns a new DevQuery containing all found elements.
* `html(string)` Sets the HTML of all queried elements
* `on({string} [event name], function)` Creates an event for the queried elements and runs the given function when the event occurs.
* `parent()` Returns a new DevQuery object containing all parent elements for every element in the initial query
* `query(string)` Same as the `find()` function, but is also used internally for the initial query
* `val(value)` Sets the value of all queried elements if they accept a value attribute.
  
#### Direct Functions

Direct functions are non-query functions.  Use syntax `$.functionName`

* `$.get(url, [optional callback])` Gets data from the provided URL and returns it as a promise.  Reading the returned data can be done via a callback function, or a standard promise `.then(data=> ... );`
* `$.post(url, data, [optional callback])` POSTs object data to the given URL.  Note that the data needs to be in a standard object key|value pairing and cannot contain functions or non-string/non-number values.  Reading the returned response can be done via a callback function, or a standard promise `.then(data=> ... );`
  Example:
  ```javascript
  $.post("submit.php", {car_model: "Ford", car_color: "Red"}).then(response=>...);
  ```
* `$.ready(function)` Runs the given function when the page is completely done loading.

#### Extended Direct Functions

Extended direct functions are sub-functions of the DevQuery object.  The extended function libraries are:
`$.urlTools` and `$.domTools`

##### Url Tools

At this time, there is only a single URL tool function but this is being expanded upon.

`$.urlTools.getUrlDataValues()` Reads the "GET" key/value pairs from the URL.  For example, if the current URL is 
```https://mydomain.com/data.php?value=10&format=list&page=1```

`$.urlTools.getUrlDataValues()` would return an object with keys "value, format, page" and their values.

`$.urlTools.getUrlDataValues().format` would return `list`

##### DOM Tools

DOM tools are extended DOM manipulation and UI tools.  They are still in development and use stateful data to automatically update the DOM as data changes.

###### Dialog Box

`$.domTools.dialogBox(options)` Creates a popup dialog box.  Options parameters are:

* title: {string} The dialog box title
* html: {string} HTML to show in the main content
* width: {string | number} Width in standard CSS syntax.  Defaults to pixels if no unit is given.
* height: {string | number} Height in standard CSS syntax.  Defaults to pixels if no unit is given.
* draggable: {Boolean} Makes the dialog box a draggable element via its title bar. *This function hasn't been fully implemented yet and is currently unavailable*
* buttons: An array of buttons where each element is an object.  The element's key will be used for the button text and its value is the function to run when that button is clicked.  The value passed to the function is the dialog box itself.  For example:
  ```javascript
    buttons: [
        { Cancel: dialog=>dialog.remove() },
        { Save: runSaveFunction }
    ]
  ```

###### Javascript Object to List

```$.domTools.dataToHtml(data, [optional options])``` converts any javascript object to an HTML string containing each key/value pair as a list element. It recursively goes through every element within the object.  

By default, it will return a standard unordered list with list elements, but you may define custom elements to replace the `ul` and `li` elements.

**Available Options:**

* list_element: The element type to replace the default ```<li>``` element
* group_element: The element type to replace the default ```<ul>``` element

Note that the replacement options require a full tag with brackets, i.e. ```<div>```.  You can include full tag syntax, including classes, styles, identifiers, etc., i.e. ```<div class="myclass" data-mydata="some data">```

There is a special string that you may pass to the list and group elements to get the current level within the list.  Include ```{index}``` anywhere in your tags to get the item tree level.  This is handy for defining custom classes based on the level within the list or printing the level in the text itself.  For example:

```javascript
$.domTools.dataToHtml(myBigDataObject, 
    {
        list_element: '<div class="level{index}"><span>Level {index}: </span></div>'
    }
);
```