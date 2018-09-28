# lottie-node

Wrapper around [Lottie](https://github.com/airbnb/lottie-web/), using node-canvas and jsdom. This is advantageous over something like PhantomJS or Chrome Headless, since it's faster and allows you to export images with opacity. It doesn't have to record in real-time, and won't get frame-skipping issues.

It only supports the Canvas renderer. SVG and HTML are not supported and can not be supported in Node.js as far as I know of. Even if it was possible, it's outside the scope of this project.

This solution is very hacky. Lottie wasn't written to support this, and node-canvas and jsdom has [some](https://github.com/Automattic/node-canvas/issues/487) [issues](https://github.com/jsdom/jsdom/issues/2067) when used together in the recommended jsdom way.

Because of this lottie-node loads lottie-web as a string, patches a method to work server-side, and then uses eval run it. Additionally this avoids polluting global declarations for `window`, `document` and `navigator`. 

This type of solution is risky and can break with the upgrade of any of the peer dependencies. Here be dragons.

## Installation

Install the [dependencies needed for node-canvas](https://github.com/Automattic/node-canvas/tree/v1.x#installation). This must be done before installing node-canvas, because node-canvas needs them to build.

After this, install lottie-node and the dependencies (node-canvas, jsdom and lottie).

`npm i canvas jsdom lottie-web lottie-node`
or
`yarn add canvas jsdom lottie-web lottie-node`

If you want to render to video you also need `ffmpeg`. Use a package manager or see the official [compilation guide](https://trac.ffmpeg.org/wiki/CompilationGuide) for how to compile it on your platform.

## Usage

1. Import `lottie-node`.
2. Call the imported method, optionally passing an argument with the path to lottie-web. This was primarily needed before [#1046](https://github.com/airbnb/lottie-web/issues/1046) was implemented, but I decided to keep the API this way to allow more flexibility, and since the lottie-web path may change.
3. This will return a method similar to lottie-web's `loadAnimation` which returns the animation. It takes three arguments:
  * data: Same as lottie-web. Can also be a path to the json file
  * rendererSettings: Same as lottie-web, but you can also pass a canvas directly (recommended)
  * options: Object literal with any **other** options you want to pass to 
Lottie's [loadAnimation()](https://github.com/airbnb/lottie-web/wiki/loadAnimation-options). Most of these doesn't make sense for the server, but `assetsPath` does.
4. Call `goToAndStop()` on the newly created animation object to render a frame.
5. On the next "tick" Lottie should have completed rendering it. use `canvas.toBuffer()` (this method is specific to node-canvas) to get a buffer of the PNG.
6  Save the buffer to a file or pipe it to ffmpeg if you want to create a video.
7. Repeat step 4-6 for all frames you want to output.

See the [examples](https://github.com/friday/lottie-node/blob/master/examples) for how to use lottie-node to render a PNG or a full video. The examples are using an animation from https://github.com/react-community/lottie-react-native.
