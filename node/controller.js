// Buttons: 18, 22, 23, 24
// LED: 25

var OPC = new require('./opc'),
    opc = new OPC('localhost', 7890),
    button1 = new GPIO(24, 'in', 'both'),
    button2 = new GPIO(22, 'in', 'both'),
    button3 = new GPIO(23, 'in', 'both'),
    button4 = new GPIO(18, 'in', 'both'),
    intervalId = -1;

button1.watch(fireplace);
button2.watch(rainbows);
button3.watch(sing);
button4.watch(darkness);

var numStrips = 3,
    ledsPerStrip = 60;

function fireplace(err, state) {
  if (state == 1) {
    cancelCurrentEffect();
    console.log("Turning on fireplace!");
  }
}

function rainbows(err, state) {
  if (state == 1) {
    cancelCurrentEffect();
    console.log("Turning on rainbows!");
  }
}

function sing(err, state) {
  if (state == 1) {
    console.log("Playing a song.");
  }
}

function darkness(err, state) {
  if (state == 1) {
    cancelCurrentEffect();

    for (var i = 0; i < (numStrips * ledsPerStrip); i++) {
      opc.setPixel(i, 0, 0, 0);
    }

  }
}

function cancelCurrentEffect() {
  if (intervalId != -1)
    clearInterval(intervalId);
}


function draw() {

}
