const path = require("path");
const fs = require("fs");
const { JSDOM } = require("jsdom");
const { Canvas, loadImage } = require("canvas");

// This is probably not the best way to handle Lottie image loading in Node.
// JSDOM's wrapped `Image` object should work, but attempts resulted in "Image given has not completed loading"
const createImgData = `function createImgData(assetData) {
  var path = getAssetsPath(assetData, this.assetsPath, this.path);
  var ob = { assetData };
  
  loadImage(path).then(image => {
    ob.img = image;
    this._imageLoaded();
  });

  return ob;
}`;

const factory = (
  lottiePath = require.resolve("lottie-web/build/player/lottie.js")
) => (animationData, rendererSettings, options = {}) => {
  const { window } = new JSDOM("", { pretendToBeVisual: true });
  const { document, navigator } = window;
  const { Image } = Canvas;

  // Avoid jsdom's canvas/image-wrappers because of:
  // * https://github.com/Automattic/node-canvas/issues/487
  // * https://github.com/jsdom/jsdom/issues/2067
  const { createElement } = document;
  document.createElement = (localName) =>
    localName === "canvas"
      ? new Canvas()
      : createElement.call(document, localName);

  const src = fs.readFileSync(path.resolve(__dirname, lottiePath), "utf8");
  // Over-specify createContent (add a Node.js-compatible variant into the code after the first)
  const patchedSrc = src.replace(
    "function ImagePreloaderFactory() {",
    `${createImgData}; function ImagePreloaderFactory() {`
  );

  // "Shadow" the Node.js module, so lottie won't reach it
  const module = {};

  // This goes against the recommendations in:
  // https://github.com/jsdom/jsdom/wiki/Don't-stuff-jsdom-globals-onto-the-Node-global#running-code-inside-the-jsdom-context
  // But using window.eval or script element occasionally causes frame skip/freeze in the output for some reason
  // This is the next best thing since it doesn't pollute globals.
  eval(patchedSrc);

  // Allow passing path instead of animationData object
  if (typeof animationData === "string") {
    animationData = JSON.parse(fs.readFileSync(animationData, "utf8"));
  }
  // Allow passing canvas instead of rendererSettings, since there isn't much choice for Node.js anyway
  if (rendererSettings instanceof Canvas) {
    rendererSettings = {
      context: rendererSettings.getContext("2d"),
      clearCanvas: true,
    };
  }
  return window.lottie.loadAnimation({
    ...options,
    animationData,
    renderer: "canvas",
    rendererSettings,
  });
};

// Export with predefined lottiePath, but add factory method to override
module.exports = Object.assign(factory(), { factory });
