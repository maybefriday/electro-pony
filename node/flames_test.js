var Canvas = require('canvas'),
    Image = Canvas.Image,
    canvas = new Canvas(800, 400),
    ctx = canvas.getContext('2d'),
    fs = require('fs');

console.log("Trying to read file");

fs.readFile('../images/flames.jpg', function(err, flames){
  if (err) throw err;
  img = new Image;
  img.src = flames;
  ctx.drawImage(img, 0, 0, img.width, img.height);
  console.log("Wrote image to canvas!");
  console.log("Buffer size: " + canvas.toBuffer().length);

});
