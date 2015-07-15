#!/usr/bin/env node

// Simple particle system example with Node and opc.js
// Specify a layout file on the command line, or use the default (grid32x16z)

var OPC = new require('./opc');
var model = OPC.loadModel('../layouts/strip64.json');
var opc = new OPC(process.argv[2] || 'localhost', 7890);

var Canvas = require('canvas'),
    Image = Canvas.Image,
    canvas = new Canvas(800, 400),
    ctx = canvas.getContext('2d');

// Buttons: 18, 22, 23, 24
// LED: 25

var GpioStream = require('gpio-stream'),
    button1 = GpioStream.readable(18),
    //button2 = GpioStream.readable(22),
    //button3 = GpioStream.readable(23),
    //button4 = GpioStream.readable(24);

// pipe the button presses to stdout
button1.pipe(process.stdout);
//button2.pipe(process.stdout);
//button3.pipe(process.stdout);
//button4.pipe(process.stdout);

console.log("Trying to read file");

fs.readFile(__dirname + '../images/flames.jpg', function(err, flames){
  if (err) throw err;
  img = new Image;
  img.src = flames;
  ctx.drawImage(img, 0, 0, img.width, img.height);
  console.log("Wrote image to canvas!");
  console.log("Buffer size: " + canvas.toBuffer().length);

});

function draw() {

    for (var i = 0; i < 192; i++) {
      var d = new Date();
      var hue = ((d.getTime() * 0.01 + i * 2.0) % 100) / 100;
      rgb = OPC.hsv(hue, 0.2, 0.8);
      opc.setPixel(i, Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2]));
    }

    opc.writePixels();

}

function updateColor(err, state) {

  // check the state of the button
  // 1 == pressed, 0 == not pressed
  if(state == 1) {
    // turn LED on
    led.writeSync(1);
  } else {
    // turn LED off
    led.writeSync(0);
  }

}

setInterval(draw, 100);
