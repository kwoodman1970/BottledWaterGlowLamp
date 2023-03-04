var Spot_canvasBackgroundColour = "#000000"; // must match common.css!

function Spot(canvasElementID, size, period, speed, fps, pattern)
{
  this.element = document.getElementById(canvasElementID);

  if (this.element != null)
    this.context = this.element.getContext("2d");

  this.angle = 0;                              // current angle of rotation

  this.setSize(size);

  if (speed != null)
    this.setSpeed(speed, fps);

  if (period != null)
    this.setPeriod(period, fps);

  this.setPattern(pattern);

  return;
}

Spot.prototype.setSize = function(size)
{
  if (this.element != null)
  {
    this.element.setAttribute("WIDTH", size);
    this.element.setAttribute("HEIGHT", size);
  }

  this.x = size / 2;
  this.y = size / 2;
  this.radius = size * 0.5;

  return;
}

Spot.prototype.setPattern = function(pattern)
{
  this.pattern = pattern;
  this.wedgeAngle = (Math.PI * 2) / this.pattern.length;

  return;
}

Spot.prototype.setSpeed = function(speed, fps)

/*
"speed" is no. of revolutions per minute (RPM's).
*/

{
  this.angleIncrement = (2 * Math.PI) / ((fps * 60) / speed);       // d-Angle between frames
  this.angleLimit     = (2 * Math.PI) - (this.angleIncrement / 2);  // when angle should be reset

  return;
}

Spot.prototype.setPeriod = function(period, fps)

/*
"period" is no. of seconds per revolution.
*/

{
  this.angleIncrement = (2 * Math.PI) / (fps * period);             // d-Angle between frames
  this.angleLimit     = (2 * Math.PI) - (this.angleIncrement / 2);  // when angle should be reset

  return;
}

Spot.prototype.draw = function()
{
  if (this.context != null)
  {
    for (var i = 0; i < this.pattern.length; ++i)
    {
      this.context.fillStyle = this.pattern[i];

      this.context.beginPath();
      this.context.moveTo(this.x, this.y);
      this.context.arc(this.x, this.y, this.radius, this.wedgeAngle * i + this.angle,
        this.wedgeAngle * (i + 1) + this.angle);
      this.context.closePath();
      this.context.fill();
    }

    this.context.strokeStyle = Spot_canvasBackgroundColour;
    this.context.linewidth = 1;

    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.stroke();
  }

  return;
}

Spot.prototype.nextFrame = function()
{
  if (this.angle > this.angleLimit)
    this.angle = this.angleIncrement;
  else
    this.angle += this.angleIncrement;

  return;
}
