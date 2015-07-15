// button is attaced to pin 24, led to 25
var GPIO = require('onoff').Gpio,
    led = new GPIO(25, 'out'),
    button = new GPIO(24, 'in', 'both');

var GpioStream = require('gpio-stream');

// Buttons: 18, 22, 23, 24
// LED: 25

var button1 = GpioStream.readable(18);
    //button2 = GpioStream.readable(22),
    //button3 = GpioStream.readable(23),
    //button4 = GpioStream.readable(24);

// pipe the button presses to stdout
button1.pipe(process.stdout);
//button2.pipe(process.stdout);
//button3.pipe(process.stdout);
//button4.pipe(process.stdout);

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

// pass the callback function to the
// as the first argument to watch()
button.watch(light);
