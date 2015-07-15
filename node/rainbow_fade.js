#!/usr/bin/env node

// Simple particle system example with Node and opc.js
// Specify a layout file on the command line, or use the default (grid32x16z)

var OPC = new require('./opc');
var model = OPC.loadModel('../layouts/strip64.json');
var opc = new OPC(process.argv[2] || 'localhost', 7890);

var GPIO = require('onoff').Gpio,
    button = new GPIO(24, 'in', 'both'),
    led = new GPIO(25, 'out');

var brightness = 0.3;

function draw() {

    for (var i = 0; i < 192; i++) {
      var d = new Date();
      var hue = ((d.getTime() * 0.01 + i * 2.0) % 100) / 100;
      rgb = OPC.hsv(hue, 0.2, brightness);
      opc.setPixel(i, Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2]));
    }

    opc.writePixels();

}

function updateBrightness(err, state) {

  // check the state of the button
  // 1 == pressed, 0 == not pressed
  if(state == 1) {
    // turn LED on
    led.writeSync(1);

    // Make LED strips brighter while button is pressed
    brightness = 0.9;

  } else {
    // turn LED off
    led.writeSync(0);

    // Return the LEDs to dimmer level
    brightness = 0.3;
  }

}

button.watch(updateBrightness);
setInterval(draw, 50);
