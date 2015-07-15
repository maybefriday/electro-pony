var OPC = new require('./opc'),
    opc = new OPC('localhost', 7890),
    numStrips = 3,
    ledsPerStrip = 60;

var Canvas = require('canvas'),
    Image = Canvas.Image,
    canvas = new Canvas(800, 400),
    context = canvas.getContext('2d'),
    fs = require('fs'),
    img = new Image;


var startingX = 50,
    interval = (canvas.width - (startingX * 2)) / ledsPerStrip,
    stripYs = [];

// Assuming LED strips are laid out horizontally, calculate
// Y values of each strip

for (var i = 0; i < numStrips; i++) {
  stripYs[i] = canvas.height * (i+1) / (numStrips+1);
}

// Load flame image

fs.readFile('../images/flames.jpg', function(err, flames){
  if (err) throw err;
  img.src = flames;
  console.log("Successfully read image!");
});

// Main loop

function draw() {
  var imHeight = img.height * canvas.width / img.width;

  // Scroll down slowly, and wrap around
  var speed = 0.05;
  var imageY = ((new Date()).getTime() * -speed) % imHeight;

  //context.drawImage(img, 0, 0, img.width, img.height);

  // Use two copies of the image, so it seems to repeat infinitely
  context.drawImage(img, 0, imageY, canvas.width, imHeight);
  context.drawImage(img, 0, imageY + imHeight, canvas.width, imHeight);

  // Get RGB data for each LED

  for (var i = 0; i < ledsPerStrip; i++) {
    var x =  startingX + (i * interval);

    for (var j = 0; j < numStrips; j++) {
      var rgb = context.getImageData(x, stripYs[j], 1, 1).data;
      opc.setPixel(i + (ledsPerStrip * j), rgb[0], rgb[1], rgb[2]);
    }

  }

  opc.writePixels();
}

setInterval(draw, 100);
