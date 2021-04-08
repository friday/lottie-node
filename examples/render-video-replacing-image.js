const { readFile } = require("fs/promises");
const renderAnimation = require("./render-animation");

(async () => {
  const data = JSON.parse((await readFile("18162-rotating-sun.json")).toString());

  // For replacing texts (not in this example), see here:
  // * https://github.com/airbnb/lottie-web/wiki/TextLayer.updateDocumentData
  // * https://github.com/airbnb/lottie-web/issues/1881

  // Replace image of the sun with local image of a pie
  // You only need to set `p` to the image src for the example to work, but the other options may be needed for other data files
  Object.assign(data.assets[0], {
    p: 'photo-1572383672419-ab35444a6934.png', // p is the image src
    e:  1, // Ignore image folder path. You can also set data.assets[0].u to an empty string
    pr: 'xMidYMid meet' // You may want to "contain" the image, see https://github.com/airbnb/lottie-web/issues/1046  
  });

  await renderAnimation({
    data,
    backgroundColor: "white",
    path: "rotating-pie.mp4",
    // FFMPEG only supports even values
    width: Math.round(data.w / 2) * 2,
    height: Math.round(data.h / 2) * 2,
  });
})();
