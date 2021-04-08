const { readFile } = require("fs/promises");
const renderAnimation = require("./render-animation");

// Ex: node render-mp4.js data.json output.mp4 blue 1920 1080
// Width and height are loaded from the json if not specified, and bgColor defaults to white
const [, , input, output, backgroundColor = "white", width, height] = process.argv;

(async () => {
  const data = JSON.parse((await readFile(input)).toString());

  await renderAnimation({
    data,
    backgroundColor,
    path: output,
    // FFMPEG only supports even values
    width: Math.round(width || data.w / 2) * 2,
    height: Math.round(height || data.h / 2) * 2,
  });
})();
