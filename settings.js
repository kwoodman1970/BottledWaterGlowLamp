var fpsInputElement      = document.getElementById("FPS");
var speedInputElement    = document.getElementById("Speed");
var periodInputElement   = document.getElementById("Period");
var sizeInputElement     = document.getElementById("Size");
var patternSelectElement = document.getElementById("Pattern");

var patterns             = new Array();

/*
patterns[0] = new Array("#FFFFFF", "#000000");
patterns[1] = new Array("#FF0000", "#00FF00", "#0000FF");
patterns[2] = new Array("#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF");
patterns[3] = new Array("#FF0000", "#FF8000", "#FFFF00", "#80FF00", "#00FF00", "#00FF80", "#00FFFF", "#0080FF", "#0000FF", "#8000FF", "#FF00FF", "#FF0080");

patterns[0] = new Array("#FF9900", "#FFCC00", "#FF9900", "#FF6600");  // Candle
patterns[1] = new Array("#00CC00", "#009900", "#00CC00", "#663300");  // Forest
patterns[2] = new Array("#3399FF", "#FFFFFF", "#66CCFF", "#000099", "#3399FF", "#66CCFF", "#000099");  // Ocean
patterns[3] = new Array("#FF0000", "#FF8000", "#FFFF00", "#80FF00", "#00FF00", "#00FF80", "#00FFFF", "#0080FF", "#0000FF", "#8000FF", "#FF00FF", "#FF0080");  // Color Wheel
*/

patterns["Candle"]       = new Array("#FF9900", "#FFCC00", "#FF9900", "#FF6600");  // Candle
patterns["Forest"]       = new Array("#00CC00", "#009900", "#00CC00", "#663300");  // Forest
patterns["Ocean"]        = new Array("#3399FF", "#FFFFFF", "#66CCFF", "#000099", "#3399FF", "#66CCFF", "#000099");  // Ocean
patterns["Colour Wheel"] = new Array("#FF0000", "#FF8000", "#FFFF00", "#80FF00", "#00FF00", "#00FF80", "#00FFFF", "#0080FF", "#0000FF", "#8000FF", "#FF00FF", "#FF0080");  // Colour Wheel

var spot = null;
var animator = null;

function initInputNumberElement(inputElement)
{
  if (inputElement != null)
  {
    var savedValue = window.localStorage.getItem(inputElement.id);

    if (savedValue != null)
    {
      if ((inputElement.min != "") && (savedValue < parseInt(inputElement.min)))
        savedValue = parseInt(inputElement.min);
      if ((inputElement.max != "") && (savedValue > parseInt(inputElement.max)))
        savedValue = parseInt(inputElement.max);

      inputElement.value = savedValue;
    }
  }

  return;
}

function initSelectElement(selectElement)
{
  var savedValue = window.localStorage.getItem(selectElement.id);

  if (savedValue != null)
  {
    var i = 0;

    while ((i < selectElement.options.length) && (selectElement.options[i] != savedValue))
      ++i;

    if (i < selectElement.options.length)
      selectElement.options.selectedIndex = i;
  }

  return;
}

function setSize()
{
  window.localStorage.setItem(sizeInputElement.id, sizeInputElement.value);
  spot.setSize((sizeInputElement.value * window.innerWidth) / 100);

  return;
}

function setRotation()
{
  window.localStorage.setItem(fpsInputElement.id, fpsInputElement.value);

  if (periodInputElement != null)
    window.localStorage.setItem(periodInputElement.id, periodInputElement.value);

  if (speedInputElement != null)
  window.localStorage.setItem(speedInputElement.id, speedInputElement.value);

  window.clearInterval(animator);

  if (periodInputElement != null)
  {
    var period = (periodInputElement.max - periodInputElement.value) + periodInputElement.min;

    spot.setPeriod(Math.sqrt(period) * 7.5, fpsInputElement.value);
  }
  else
    spot.setSpeed((Math.sqrt(speedInputElement.value) - 1) * 59 / 8 + 1, fpsInputElement.value);

  animator = window.setInterval(animate, 1000 / fpsInputElement.value);

  return;
}

function setPattern()
{
  window.localStorage.setItem(patternSelectElement.id, patternSelectElement.value);
  spot.setPattern(patterns[patternSelectElement.options[patternSelectElement.options.selectedIndex].text]);

  return;
}

function animate()
{
  spot.draw();
  spot.nextFrame();

  return;
}

initInputNumberElement(fpsInputElement);
initInputNumberElement(periodInputElement);
initInputNumberElement(speedInputElement);
initInputNumberElement(periodInputElement);
initInputNumberElement(sizeInputElement);
initSelectElement(patternSelectElement);

var selectedPatternIndex  = patternSelectElement.options.selectedIndex;
var selectedPatternName   = patternSelectElement.options[selectedPatternIndex].text;
var selectedPatternLength = patterns[selectedPatternName].length;

spot = new Spot("Spot", (sizeInputElement.value * window.innerWidth) / 100,
  (periodInputElement == null ? null : periodInputElement.value),
  (speedInputElement == null ? null : speedInputElement.value), fpsInputElement.value,
  patterns[patternSelectElement.options[patternSelectElement.options.selectedIndex].text]);

animator = window.setInterval(animate, 1000 / fpsInputElement.value);
