// ============================================================================================
// HIDDEN FUNCTIONS
// ============================================================================================

/*********************************************************************************************/

function _updateManager(evnt)
{
  var removeEventListeners = false;
  var statusElement        = document.getElementById("UpdateStatus");

  if (statusElement != null)
  {
    switch(evnt.type)
    {
      case "offline":
        statusElement.innerHTML = "Not connected to the Internet.";
        break;

      case "online":
        statusElement.innerHTML = "Connected to the Internet.";
        break;

      case "checking":
        statusElement.innerHTML = "Checking...";
        break;

      case "noupdate":
        statusElement.innerHTML = "No new version.";
        break;

      case "downloading":
        statusElement.innerHTML = "Downloading new version...";
        break;

      case "progress":
          if (evnt.lengthComputable)
          {
            var percentage = Math.floor((evnt.loaded / evnt.total) * 100).toString();

            statusElement.innerHTML = "Downloading (" + percentage + "%)...";
          }
          else
            statusElement.innerHTML = statusElement.innerHTML + ".";
        break;

      case "cached":
        statusElement.innerHTML = "Installing new version...";
        break;

      case "updateready":
        statusElement.innerHTML = "Restarting...";
        break;

      case "obsolete":
        statusElement.innerHTML = "No longer available.";
        break;

      case "error":
        statusElement.innerHTML = "Error&nbsp;&ndash; unable to update.";
        break;
    }
  }

  switch(evnt.type)
  {
    case "online":
      if (window.applicationCache.status == window.applicationCache.IDLE)
        window.applicationCache.update()
      break;

    case "noupdate":
    case "obsolete":
      removeEventListeners = true;
      updateManager_setLastChecked();
      break;

    case "updateready":
      window.applicationCache.swapCache();
      window.location.reload();
      break;
  }

  if (removeEventListeners)
  {
    window.removeEventListener("offline", _updateManager, false);
    window.removeEventListener("online",  _updateManager, false);

    window.applicationCache.removeEventListener("checking",    _updateManager, false);
    window.applicationCache.removeEventListener("noupdate",    _updateManager, false);
    window.applicationCache.removeEventListener("downloading", _updateManager, false);
    window.applicationCache.removeEventListener("progress",    _updateManager, false);
    window.applicationCache.removeEventListener("cached",      _updateManager, false);
    window.applicationCache.removeEventListener("updateready", _updateManager, false);
    window.applicationCache.removeEventListener("obsolete",    _updateManager, false);
    window.applicationCache.removeEventListener("error",       _updateManager, false);
  }

  return;
}

/*********************************************************************************************/

function updateManager_getLastChecked()
{
  var lastCheckedFinder = /\bupdateManager_lastChecked\s*=\s*(\d+)\b/;
  var results           = lastCheckedFinder.exec(document.cookie);

  return (results == null ? null : new Date(parseInt(results[1], 10)));
}

/*********************************************************************************************/

function updateManager_setLastChecked()
{
  var now = new Date();

  document.cookie = "updateManager_lastChecked=" + now.getTime();
  return;
}

/*********************************************************************************************/

function updateManager_check()
{
  var lastCheckedFinder = /\bupdateManager_lastChecked\s*=\s*(\d+)\b/;
  var results           = lastCheckedFinder.exec(document.cookie);
  var timeLimit         = 86400000;

  if (results == null)
    return true;
  else
  {
    var now         = new Date();
    var lastChecked = new Date(parseInt(results[1], 10));

    return (now - lastChecked > timeLimit);
  }
}

// ============================================================================================
// EXECUTABLE CODE
// ============================================================================================

/*
This is where the event handlers are attached to the "window" and "window.applicationCache"
objects.
*/

if (updateManager_check())
{
  window.addEventListener("offline", _updateManager, false);
  window.addEventListener("online",  _updateManager, false);

  window.applicationCache.addEventListener("checking",    _updateManager, false);
  window.applicationCache.addEventListener("noupdate",    _updateManager, false);
  window.applicationCache.addEventListener("downloading", _updateManager, false);
  window.applicationCache.addEventListener("progress",    _updateManager, false);
  window.applicationCache.addEventListener("cached",      _updateManager, false);
  window.applicationCache.addEventListener("updateready", _updateManager, false);
  window.applicationCache.addEventListener("obsolete",    _updateManager, false);
  window.applicationCache.addEventListener("error",       _updateManager, false);

  /*
  It is possible that the browser has started the update process before the event handlers are
  attached or the DOM content has fully loaded.  Therefore, "navigator.onLine" and
  "window.applicationCache.status" should be checked when the DOM content has loaded to see
  what state the update process is in and call "_updateManager()" with an appropriate
  pseudo-"event" object.
  */

  document.addEventListener("DOMContentLoaded",
    function(evnt)
    {
      if (navigator.onLine)
      {
        _updateManager({type:  "online"});

        switch(window.applicationCache.status)
        {
          case window.applicationCache.UNCACHED:
          case window.applicationCache.IDLE:
            _updateManager({type:  "noupdate"});
            break;

          case window.applicationCache.CHECKING:
            _updateManager({type:  "checking"});
            break;

          case window.applicationCache.DOWNLOADING:
            _updateManager({type:  "downloading"});
            break;

          case window.applicationCache.UPDATEREADY:
            _updateManager({type:  "updateready"});
            break;

          case window.applicationCache.OBSOLETE:
            _updateManager({type:  "obsolete"});
            break;

          default:
            break;
        }
      }
      else
        _updateManager({type:  "offline"});
    },
    false);
}
