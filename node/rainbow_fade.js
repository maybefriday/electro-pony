#!/usr/bin/env node

// Simple particle system example with Node and opc.js
// Specify a layout file on the command line, or use the default (grid32x16z)

var OPC = new require('./opc');
var model = OPC.loadModel('../layouts/strip64.json');
var opc = new OPC(process.argv[2] || 'localhost', 7890);

function draw() {

    for (var i = 0; i < 192; i++) {
      var d = new Date();
      var hue = ((d.getTime() * 0.01 + i * 2.0) % 100) / 100;
      rgb = OPC.hsv(hue, 0.2, 0.8);
      opc.setPixel(i, Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2]));
    }

    opc.writePixels();

}

var Dot = function(position, radius, color) {

    var circle = new Path.Circle({
        center: position,
        radius: radius,
    });

    circle.fillColor = {
        gradient: {
            stops: [['white', 0], [color, 0.6], ['black', 1]],
            radial: true
        },
        origin: circle.position,
        destination: circle.bounds.rightCenter
    };

    // Store a rasterized version of this path, for speed
    this.path = circle.rasterize();
    circle.remove();

    // Treat dots as lamps that make the scene brighter wherever they are
    this.path.blendMode = 'add';
    this.path.opacity = 0.9;

    // Dots have velocity, so they overshoot and bounce around as they move
    this.velocity = new Point(0, 0);
    this.target = position;

    // Physical parameters
    this.acceleration = 0.2;
    this.damping = 0.3;
}

setInterval(draw, 100);
