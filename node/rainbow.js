#!/usr/bin/env node

var Rainbow = function(opc, numLeds)
{
    this.opc = opc;
    this.numLeds = numLeds;

    _this = this;
};

Rainbow.prototype.go = function() {
  return setInterval(this._draw, 100);
}

Fireplace.prototype._draw = function() {

    for (var i = 0; i < _this.numLeds; i++) {
      var d = new Date();
      var hue = ((d.getTime() * 0.01 + i * 2.0) % 100) / 100;
      rgb = OPC.hsv(hue, 0.2, 0.8);
      _this.opc.setPixel(i, rgb[0], rgb[1], rgb[2]);
    }

    _this.opc.writePixels();
}

module.exports = Rainbow;
