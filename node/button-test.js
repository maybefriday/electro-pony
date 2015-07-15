// button is attaced to pin 24, led to 25
var GPIO = require('onoff').Gpio,
    led = new GPIO(25, 'out'),
    button = new GPIO(24, 'in', 'both');

var GpioStream = require('gpio-stream');


var button1 = GpioStream.readable(18);

// pipe the button presses to stdout
button1.pipe(process.stdout);

// define the callback function
function light(err, state) {

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

