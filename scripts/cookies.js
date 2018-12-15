/**
 * Set a cookie
 * @param {String} cname, cookie name
 * @param {String} cvalue, cookie value
 * @param {Int} exdays, number of days before the cookie expires 
*/
function setCookie(cname,cvalue,exdays) {
    var d = new Date(); //Create an date object
    d.setTime(d.getTime() + (exdays*1000*60*60*24)); //Set the time to exdays from the current date in milliseconds. 1000 milliseonds = 1 second
    var expires = "expires=" + d.toGMTString(); //Compose the expirartion date
    window.document.cookie = cname+"="+cvalue+"; "+expires;//Set the cookie with value and the expiration date
}

/**
 * Get a cookie
 * @param {String} cname, cookie name
 * @return {String} String, cookie value 
 */
function getCookie(cname) {
    var name = cname + "="; //Create the cookie name variable with cookie name concatenate with = sign
    var cArr = window.document.cookie.split(';'); //Create cookie array by split the cookie by ';'
     
    //Loop through the cookies and return the cooki value if it find the cookie name
    for(var i=0; i<cArr.length; i++) {
        var c = cArr[i].trim();
        //If the name is the cookie string at position 0, we found the cookie and return the cookie value
        if (c.indexOf(name) == 0) 
            return c.substring(name.length, c.length);
    }
     
    //If we get to this point, that means the cookie wasn't find in the look, we return an empty string.
    return "";
}

/**
 * Delete a cookie
 * @param {String} cname, cookie name
 */
function deleteCookie(cname) {
    var d = new Date(); //Create an date object
    d.setTime(d.getTime() - (1000*60*60*24)); //Set the time to the past. 1000 milliseonds = 1 second
    var expires = "expires=" + d.toGMTString(); //Compose the expirartion date
    window.document.cookie = cname+"="+"; "+expires;//Set the cookie with name and the expiration date
 
}