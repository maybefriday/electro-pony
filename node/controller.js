// Buttons: 18, 22, 23, 24
// LED: 25

var OPC = new require('./opc'),
    opc = new OPC("electropony.local", 7890),
    GPIO = require('onoff').Gpio,
    Fireplace = require('./fireplace'),
    Rainbow = require('./rainbow'),
    button1 = new GPIO(24, 'in', 'both'),
    button2 = new GPIO(23, 'in', 'both'),
    button3 = new GPIO(22, 'in', 'both'),
    button4 = new GPIO(18, 'in', 'both'),
    exec = require('child_process').exec,
    intervalId = -1;
    numStrips = 3,
    ledsPerStrip = 60,
    child = null;

button1.watch(showFireplace);
button2.watch(showRainbow);
button3.watch(playSong);
button4.watch(shutItDown);

showFireplace(null, 1);

function testSequence() {
  console.log("trying LED test sequence");
  for (var i = 0; i < 192; i++) {
    opc.setPixel(i, 255, 255, 255);
  }
  opc.writePixels();
}

function showFireplace(err, state) {
  if (state == 1) {
    cancelCurrentEffect();
    console.log("Turning on fireplace!");
    var fireplace = new Fireplace(opc, numStrips, ledsPerStrip);
    intervalId = fireplace.go();
  }
}

function showRainbow(err, state) {
  if (state == 1) {
    cancelCurrentEffect();
    console.log("Turning on rainbows!");
    var rainbow = new Rainbow(opc, numStrips * ledsPerStrip);
    intervalId = rainbow.go();
  }
}

function playSong(err, state) {
  if (state == 1) {
    console.log("Playing a song.");

    killMusic();

    child = exec('omxplayer -o local /home/pi/electro-pony/sounds/pony.mp3',
      function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
    console.log("Starting child process with pid " + child.pid);
  }
}

function shutItDown(err, state) {
  if (state == 1) {
    console.log("Turn off all the things.");
    cancelCurrentEffect();

    killLights();
    killMusic();
  }
}

function killLights() {
  console.log("Turning off LEDs.");

  for (var i = 0; i < (numStrips * ledsPerStrip); i++) {
    opc.setPixel(i, 0, 0, 0);
  }
  opc.writePixels();

}

function killMusic() {
  if (child != null) {
    console.log("Turning off omxplayer");

    // Ideally we'd kill the child process, but this doesn't seem to work on
    // the pi with omxplayer, for some reason.
    exec('pkill omxplayer',
      function(err, stdout, stderr) {
        if (stdout) console.log('stdout:' + stdout);
        if (stderr) console.log('stderr:' + stderr);
        if (err) throw err;
    });

  }
}

function cancelCurrentEffect() {
  if (intervalId != -1) {
    console.log("canceling current effect with interval id " + intervalId);
    clearInterval(intervalId);
  }

}

