// ============================================================================================
// DESCRIPTION
// ============================================================================================

/*
This script file instanciates an object called "webApp", whose memmbers and methods make it
easier to develop webapps.

This object can be used to perform functions common to web apps
*/

/*
This script will create a global variable called "appInstalled" and set it to "true" if the web
page that includes this script has been installed on a smart device's home screen and "false"
if it hasn't been installed.

If the installation status can't be reliably determined then "appInstalled" will be "null".

Later scripts can check this variable and -- for example -- display instructions for completing
the installation process.

This script is not intended to be used in desktop browsers.
*/

// ============================================================================================
// HOW TO USE
// ============================================================================================

/*
If you're using a JSON manifest file (and you should!), add "installed=true" to the "start_url"
value as one of the GET-style arguments and set the display mode to "standalone" -- for
example:

  "start_url":  "index.html?installed=true",
  "display":    "standalone"

In the "index.html" file, add "installed=true" to the "msapplication-startul" meta content in
the <HEAD> section as one of the GET-style arguments -- for example:

  <META NAME="msapplication-starturl" CONTENT="index.html?installed=true">

*/

// ============================================================================================
// DESIGN NOTES
// ============================================================================================

/*
Browser manufacturers have (again) implemented their own proprietary means of determining
webapp installation status -- if, indeed, they actually have done so -- instead of agreeing to
a standard method beforehand.  So, again, the developers are left to write browser-specific
code and rely on hacks to do a simple, important task:  determine if the user actually has
installed the webapp.

Apple have implemented the simplest and easiest technique, which makes it the best solution
(IMNSHO).  Mobile Safari includes a proprietary extension to the "window.navigator" BOM object:
the "standalone" property.  This property is "true" if the webapp has been installed and
"false" if it hasn't.

Google, Opera and Mozilla, meanwhile, seem to be colluding on JSON manifest files.  One of the
values that can be set is "start_url", which can include GET-style arguments.  A hack is used
to determine the installation status in their browsers:  if one of those arguments is
"installed=true" then this script will consider the webapp to have been installed (see "How to
Use" above).

Checking screen & window sizes is unpredictable and a less-than-perfect solution -- therefore,
that technique is not used.
*/

// ============================================================================================
// GLOBAL VARIABLES
// ============================================================================================

var webApp = new Object;                  // the object that makes it easier to develop webapps

// ============================================================================================
// MEMBER VARIABLES
// ============================================================================================

/*
"webApp.installed" will be "true" if the app has been installed, "false" if it hasn't or "null"
if indeterminate.

"webApp.os" will be one of "UnknownOS", "Android", "BlackBerry", "iOS" or "WindowsMobile".
*/

webApp.installed = window.navigator.standalone;      // has the webapp been installed (checking
                                                     //   Mobile Safari first)?
webApp.os        = "UnknownOS";                      // which OS the webapp is running on

// ============================================================================================
// METHODS
// ============================================================================================

/*********************************************************************************************/

webApp.setInstalled = function()

/*
This method forces the webapp to be considered to have been installed.  The developer should
call this method when the ".installed" member is "null" (indicating indeterminate) AND the user
indicates that they have, indeed, installed the app and doesn't need to be asked again.
*/

{
  /*
  Local storage is used to remember that the app has been installed.  See "Installation Status
  Member Initializer" below.
  */

  window.localStorage.setItem("appInstalled", "true");

  this.installed = true;

  var elements = document.getElementsByClassName("MaybeInstalled");

  for (var i = 0; i < elements.length; ++i)
    elements[i].style.display = "none";

  elements = document.getElementsByClassName("NotInstalled");

  for (var i = 0; i < elements.length; ++i)
    elements[i].style.display = "none";

  elements = document.getElementsByClassName("Installed");

  for (var i = 0; i < elements.length; ++i)
    elements[i].style.display = "inherit";

  return;
}

/*********************************************************************************************/

webApp.showPage = function(elementID)

/*
This method hides all elements of class "Page" except for the one whose ID is "elementID".
*/

{
  /*
  The algorithm is straightforward enough:  iterate through all elements of class "Page" and
  set its "display" DOM style attribute to either "none" or "inherit" depending on its ID.

  Exceptions are thrown if there are no such elements or if the element whose ID is "elementID"
  isn't found.
  */

  var allPages = document.getElementsByClassName("Page");      // all elements of class "Page"
  var found    = false;                                        // was the one to display found?

  if (allPages.length == 0)
    throw "webapp.showPage(\"" + elementID + "\"):  No elements of class \"Page\" found.";

  for (var i = 0; i < allPages.length; ++i)
  {
    if (allPages[i].id == elementID)
    {
      allPages[i].style.display = "inherit";
      found = true;
    }
    else
      allPages[i].style.display = "none";
  }

  if ((elementID != null) && !found)
    throw "webapp.showPage(\"" + elementID + "\"):  Element \"" + elementID + "\" not found.";

  return;
}

/*********************************************************************************************/

webApp.warnIfOffline = function(warningMessage)

/*
This method is a convenience to the developer.  It displays a warning message if the device is
offline.
*/

{
  if (!window.navigator.onLine)
    window.alert(warningMessage == null ? "Internet access is required." : warningMessage);

  return;
}

/*********************************************************************************************/

webApp.loadIfOnline = function(url, offlineMessage)

/*
This method is a convenience to the developer.  It loads a web page if the device is online and
displays a warning message if the it's offline.

This could be called, for example, from an "ONCLICK" HTML attribute if an external page is to
be loaded from the Internet but it is known that it can't be retrieved.
*/

{
  if (window.navigator.onLine)
  {
    if (url != null)
      window.location.href = url;

    return true;
  }
  else
  {
    window.alert(offlineMessage == null ? "Internet access is required." : offlineMessage);

    return false;
  }
}

/*********************************************************************************************/

webApp.load = function(url, targetWindow)

/*
This method is a convenience to the developer.  It loads an external web page.  If
"targetWindow" isn't null then the page is opened in an external window.
*/

{
  if (targetWindow == null)
    window.location.href = url;
  else
    window.open(url, targetWindow);

  return;
}

// ============================================================================================
// HIDDEN METHODS
// ============================================================================================

/*********************************************************************************************/

webApp._onOff_onClick = function(evnt)
{
  if (evnt.currentTarget.className.search(/\bOff\b/g) < 0)
    evnt.currentTarget.className += " Off";
  else
    //evnt.currentTarget.className = evnt.currentTarget.className.replace(/(?:^|\s+)Off\b/g, "");
    evnt.currentTarget.className = evnt.currentTarget.className.replace(/\bOff\b/g, "");

  return;
}

// ============================================================================================
// INSTALLATION STATUS MEMBER INITIALIZER
// ============================================================================================

/*
There are currently five separate tests that can be performed to determine if a web app has
been properly installed on a mobile device.  Two of them are proprietary which, ironicly, makes
the testing process easier and more accurate.  Two of them aren't universally supported yet and
have some gotchas to watch out for.

The first test is Apple's proprietary method:  "window.navigator.standalone" will be "true" if
installed, "false" if not installed and "null" if the member is not present.

This test was applied when "webApp.installed" was declared and initialized above.
*/

if (webApp.installed == null)
{
  /*
  The second test is Microsoft's proprietary method:  "window.external.msIsSiteMode()" will
  return "true" if installed and "false" if not installed.  If the method doesn't exist then
  trying to call it will generate an exception.
  */

  try
  {
    webApp.installed = window.external.msIsSiteMode();
  }
  catch (excptn)
  {
    /*
    The third test is a relatively new cross-platform method that involves inspecting
    "window.matchMedia("(display-mode:  standalone)").matches", but there's a gotcha to watch
    out for.

    If the browser supports the "standalone" display mode then that member will be "true" if
    installed and "false" if not installed.  HOWEVER, if the browser doesn't support the
    "standalone" display mode (it may fall back to "minimum-ui" or "browser") then the member
    will be "false" even if the web app has been installed.

    Some browsers don't support the "window.matchMedia()" method, so trying to call it will
    generate an exception.
    */

    try
    {
      if (window.matchMedia("(display-mode:  standalone)").matches)
        webApp.installed = true;
    }
    catch (excptn2) {}

    if (webApp.installed == null)
    {
      /*
      The fourth test depends on whether or not something like the following line appears in
      the JSON manifest file (you did read the "HOW TO USE" section at the top of this script,
      didn't you?):

        "start_url":  "filename.html?installed=true"

      As of this writing, the W3C working draft on JSON manifest files mentions that this
      technique can be useful for determining whether or not a web app has been installed, but
      there's a catch:  some browsers don't support this technique for privacy reasons
      described in the same draft.

      If "installed=true" appears as a GET-style parameter in the "window.location.search"
      member then the web app has been installed.
      */

      var detectInStartURL = /[?&]installed=true(?:\&|$)/i;       // RegEx pattern to test with

      if (detectInStartURL.test(window.location.search))
        webApp.installed = true;

      /*
      The final test is to see if "webApp.setInstalled()" has been called.  If it has then the
      "appInstalled" item in local storage will have been set to "true", which, generally,
      means that the user has explicitly indicated that the web app has been installed.
      */

      else if (window.localStorage.getItem("appInstalled") == "true")
        webApp.installed = true;
    }
  }
}

/*
There aren't any other reliable ways to determine whether the web app has been installed or
not, so, if the above tests have given indeterminate results then "webApp.installed" will end
up being "null".
*/

// ============================================================================================
// OS MEMBER INITIALIZER
// ============================================================================================

/*
At this point, the ".os" member will be set to "Unknown".  The browser's user agent string is
inspected to determine which operating system the webapp is running on (see ".os" member
above).

Netscape Communications COULD'VE implemented an object with members such as ".os",
".osVersion", ".renderer", ".rendererVersion", etc., when they first introduced JavaScript and
DOM, but no-o-o, they thought that the HTTP user agent string was good enough...
*/

if (navigator.userAgent.search(/\bAndroid\b/i) >= 0)
  webApp.os = "Android";
else if (navigator.userAgent.search(/\bBlackBerry\b|\bBB\b/i) >= 0)
  webApp.os = "BlackBerry";
else if (navigator.userAgent.search(/\biPhone\b|\biPad\b|\biPod\b/i) >= 0)
  webApp.os = "iOS";
/*else if (navigator.userAgent.search(/\bKindle\b/i) >= 0)
  webApp.os = "Kindle";
else if (navigator.userAgent.search(/\bLinux\b/i) >= 0)
  webApp.os = "Linux";
else if (navigator.userAgent.search(/\bMac\b/i) >= 0)
  webApp.os = "Macintosh";
else if (navigator.userAgent.search(/\bOpenBSD\b/i) >= 0)
  webApp.os = "OpenBSD";
else if (navigator.userAgent.search(/\bSymbianOS\b/i) >= 0)
  webApp.os = "SymbianOS";*/
else if (navigator.userAgent.search(/\bMobileIE\b|\bWindows Phone\b/i) >= 0)
  webApp.os = "WindowsMobile";
/*else if (navigator.userAgent.search(/\bWin\b/i) >= 0)
  webApp.os = "Windows";
else if (navigator.userAgent.search(/\bX11\b/i) >= 0)
  webApp.os = "UNIX";*/

// ============================================================================================
// DEFERRED ACTIONS
// ============================================================================================

/*
The following are actions that will take place after the DOM has been loaded.
*/

document.addEventListener(
  "DOMContentLoaded",
  function()
  {
    /*
    First, unhide all the elements for the host operating system.
    */

    var elements = document.getElementsByClassName(webApp.os);

    for (var i = 0; i < elements.length; ++i)
      elements[i].style.display = "inherit";

    /*
    Next, unhide all the elements corresponding to the installation status.
    */

    if (webApp.installed == null)
      elements = document.getElementsByClassName("MaybeInstalled");
    else if (webApp.installed)
      elements = document.getElementsByClassName("Installed");
    else
      elements = document.getElementsByClassName("NotInstalled");

    for (var i = 0; i < elements.length; ++i)
      elements[i].style.display = "inherit";

    /*
    Next, display the Back Button (if it exists) on iOS devices and add the script that makes
    it function as such.  Remember:  Apple is the computer company that gave us the one-button
    mouse!
    */

    if (webApp.os == "iOS")
    {
      var backButtonElement = document.getElementById("BackButton");

      if (backButtonElement != null)
      {
        backButtonElement.style.display = "inherit";

        backButtonElement.addEventListener("click", function(evnt) {history.back();}, false);
      }
    }

    /*
    Last, add the scripts to the buttons so that their appearance will be changed by clicks
    and taps.
    */

    var buttons = document.getElementsByTagName("BUTTON");

    for (var i = 0; i < buttons.length; ++i)
    {
      if (buttons[i].className.search(/\bOnOff\b/g) >= 0)
        buttons[i].addEventListener("click", webApp._onOff_onClick, false);
    }

    return;
  },
  false);
