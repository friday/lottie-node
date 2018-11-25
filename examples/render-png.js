// Render a single PNG image from the middle of the animation
const fs = require('fs');
const {createCanvas} = require('canvas');
const lottie = require('lottie-node');

const canvas = createCanvas(360, 640);
const animation = lottie(`${__dirname}/LottieLogo2.json`, canvas);
const middleFrame = Math.floor(animation.getDuration(true) / 2);
animation.goToAndStop(middleFrame, true);
setImmediate(() => {
  fs.writeFile(`${__dirname}/output.png`, canvas.toBuffer(), err => {
    if (err) {
      throw err;
    }
  });
});
