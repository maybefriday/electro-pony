var OPC = new require('./opc');
var opc = new OPC(process.argv[2] || 'localhost', 7890);

var Canvas = require('canvas'),
    Image = Canvas.Image,
    canvas = new Canvas(800, 400),
    context = canvas.getContext('2d'),
    fs = require('fs');


var interval = (canvas.width - 100) / 60,
    startingPoint = 50,
    strip1Y = canvas.height / 4,
    strip2Y = canvas.height * 2 / 4,
    strip3Y = canvas.height * 3 / 4;

console.log("Trying to read file");

var img = new Image;

fs.readFile('../images/flames.jpg', function(err, flames){
  if (err) throw err;
  img.src = flames;
  console.log("Successfully read image!");
});

function draw() {
  var imHeight = img.height * canvas.width / img.width;

  // Scroll down slowly, and wrap around
  var speed = 0.05;
  var imageY = ((new Date()).getTime() * -speed) % imHeight;

  //context.drawImage(img, 0, 0, img.width, img.height);

  // Use two copies of the image, so it seems to repeat infinitely
  context.drawImage(img, 0, imageY, canvas.width, imHeight);
  context.drawImage(img, 0, imageY + imHeight, canvas.width, imHeight);

  for (var i = 0; i < 60; i++) {
    var x =  startingPoint + (i * interval);
    //console.log("Getting pixel color at: " + x + ", " + centerY);
    var rgb1 = context.getImageData(x, strip1Y, 1, 1).data;
    var rgb2 = context.getImageData(x, strip2Y, 1, 1).data;
    var rgb3 = context.getImageData(x, strip3Y, 1, 1).data;
    //console.log("Setting pixel to: " + rgb[0] + ", " + rgb[1] + ", " + rgb[2]);
    opc.setPixel(i, rgb1[0], rgb1[1], rgb1[2]);
    opc.setPixel(i + 60, rgb2[0], rgb2[1], rgb2[2]);
    opc.setPixel(i + 120, rgb3[0], rgb3[1], rgb3[2]);

  }

  opc.writePixels();
}

setInterval(draw, 50);
