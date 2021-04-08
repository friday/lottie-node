const { readFile } = require("fs/promises");
const renderAnimation = require("./render-animation");

(async () => {
  const data = JSON.parse((await readFile("18162-rotating-sun.json")).toString());

  // Replace image of the sun with local image of a pie
  data.assets[0].p = 'photo-1572383672419-ab35444a6934.png'

  await renderAnimation({
    data,
    backgroundColor: "white",
    path: "rotating-pie.mp4",
    // FFMPEG only supports even values
    width: Math.round(data.w / 2) * 2,
    height: Math.round(data.h / 2) * 2,
  });
})();
