# lottie-node

Wrapper around [lottie-web](https://github.com/airbnb/lottie-web/), using node-canvas and jsdom. This is advantageous over something like PhantomJS or Chrome Headless, since it's faster and allows you to export images with opacity. It doesn't have to record in real-time, and won't get frame-skipping issues.

It only supports the Canvas renderer. SVG and HTML are not supported and can not be supported in Node.js as far as I know of. Even if it was possible, it's outside the scope of this project.

This solution is very hacky. Lottie wasn't written to support this, and node-canvas and jsdom has [some](https://github.com/Automattic/node-canvas/issues/487) [issues](https://github.com/jsdom/jsdom/issues/2067) when used together in the recommended jsdom way.

Because of this lottie-node loads lottie-web as a string, patches a method to work server-side, and then uses eval run it. Additionally this avoids polluting global declarations for `window`, `document` and `navigator`. 

This type of solution is risky and can break with the upgrade of any of lottie-nodes peer dependencies. Here be dragons.

## Installation

`npm i canvas jsdom lottie-web lottie-node`
or
`yarn add canvas jsdom lottie-web lottie-node`

## Usage

1. Import `lottie-node`.
2. Call the imported method, optionally passing an argument with the path to lottie-web. This was primarily needed before [#1046](https://github.com/airbnb/lottie-web/issues/1046) was implemented, but I decided to keep the API this way to allow more flexibility, and since the lottie-web path may change.
3. This will return a method similar to lottie-web's `loadAnimation` which returns the animation. It takes three arguments:
  * data: Same as lottie-web. Can also be a path to the json file
  * rendererSettings: Same as lottie-web, but you can also pass a canvas directly (recommended)
  * options: Object literal with any **other** options you want to pass to 
Lottie's [loadAnimation()](https://github.com/airbnb/lottie-web/wiki/loadAnimation-options). Most of these doesn't make sense for the server, but `assetsPath` does.
4. Call `goToAndStop()` on the newly created animation object to render a frame.
5. On the next "tick" lottie should have completed rendering it. use `canvas.toBuffer()` (this method is specific to node-canvas) to get a buffer of the PNG.
6  Save the buffer to a file or pipe it to ffmpeg if you want to create a video.
7. Repeat step 4-6 for all frames you want to output.

### Examples

#### Render the middle frame to png

```js
const fs = require('fs');
const Canvas = require('canvas');
const lottie = require('lottie-node')();
const canvas = new Canvas(1920, 1080);
const animation = lottie('/path/to/data.json', canvas, {assetsPath: '/path/to/assets'});
const frameCount = animation.getDuration(true);
const middleFrame = Math.floor(frameCount / 2);
animation.goToAndStop(middleFrame, true);
// Wait until next "tick" to output the file 
setImmediate(async () => {
  await fs.writeFile('/path/to/frame.png', canvas.toBuffer());
});
```
