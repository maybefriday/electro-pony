var Canvas = require('canvas'),
    Image = Canvas.Image,
    canvas = new Canvas(800, 400),
    context = canvas.getContext('2d'),
    fs = require('fs'),
    img = new Image,
    startingX = 50,
    stripYs = [],
    interval,
    _this;


var Fireplace = function(opc, numStrips, ledsPerStrip)
{
    this.opc = opc;
    this.numStrips = numStrips;
    this.ledsPerStrip = ledsPerStrip;

    interval = (canvas.width - (startingX * 2)) / this.ledsPerStrip;

    // Assuming LED strips are laid out horizontally, calculate
    // Y values of each strip

    for (var i = 0; i < this.numStrips; i++) {
      stripYs[i] = canvas.height * (i+1) / (this.numStrips+1);
    }

    // Load flame image

    fs.readFile('../images/flames.jpg', function(err, flames){
      if (err) throw err;
      img.src = flames;
    });

    _this = this;
};

Fireplace.prototype.go = function() {
  return setInterval(this._draw, 100);
}

// Main loop -- only called internally

Fireplace.prototype._draw = function() {
  var imHeight = img.height * canvas.width / img.width;

  // Scroll down slowly, and wrap around
  var speed = 0.05;
  var imageY = ((new Date()).getTime() * -speed) % imHeight;

  // Use two copies of the image, so it seems to repeat infinitely
  context.drawImage(img, 0, imageY, canvas.width, imHeight);
  context.drawImage(img, 0, imageY + imHeight, canvas.width, imHeight);

  // Get RGB data for each LED

  for (var i = 0; i < _this.ledsPerStrip; i++) {
    var x =  startingX + (i * interval);

    for (var j = 0; j < _this.numStrips; j++) {
      var rgb = context.getImageData(x, stripYs[j], 1, 1).data;
      _this.opc.setPixel(i + (_this.ledsPerStrip * j), rgb[0], rgb[1], rgb[2]);
    }

  }

  _this.opc.writePixels();
}

module.exports = Fireplace;
