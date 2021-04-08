// Render a single PNG image from the middle of the animation
const { readFile, writeFile } = require("fs/promises");
const { createCanvas } = require("canvas");
const lottie = require("lottie-node");

const [, , input, output, width, height] = process.argv;

(async () => {
  const data = JSON.parse((await readFile(input)).toString());
  const canvas = createCanvas(width || data.w, height || data.h);
  const animation = lottie(data, canvas);
  const middleFrame = Math.floor(animation.getDuration(true) / 2);
  animation.goToAndStop(middleFrame, true);
  setImmediate(async () => {
    await writeFile(output, canvas.toBuffer());
    // Lottie needs to be forced to exit for some reason
    process.exit(0);
  });
})();
