# lottie-node

lottie-node is an API for runnig [Lottie](https://github.com/airbnb/lottie-web/) with the canvas renderer in Node.js, with the help of [node-canvas](https://github.com/Automattic/node-canvas) and [jsdom](https://github.com/jsdom/jsdom). This is intended for rendering Lottie animations to images or video. Using Node for rendering is advantageous over something like PhantomJS, since it's faster and allows you to export images with opacity. It doesn't have to record in real-time, and you won't have a problem with frame-skipping.

## Installation

Install lottie-node and the peer-dependencies:

`npm i canvas jsdom lottie-web lottie-node`
or
`yarn add canvas jsdom lottie-web lottie-node`

Node-Canvas will most likely download a pre-built binary release for your cpu architecture rather than building it. If this isn't the case for you, you should install the [libraries](https://github.com/Automattic/node-canvas#compiling) needed for the build.

If you want to render to video you also need ffmpeg. See [Rendering to video](#rendering-to-video)

## Usage

```js
const lottieNode = require('lottie-node');
```

or

```js
import lottieNode from 'lottie-node';
```

If you need to specify the path to Lottie (if you have altered it for example) you can do it this way:

```js
const lottieNode = require('lottie-node').factory('/path/to/lottie.js');
```

`lottieNode` (as created above) is a similar to lottie-web's `loadAnimation`, but the arguments are simplified since most of the Lottie options aren't relevant for rendering on the server.

It takes three arguments:

* `data`: Same as lottie-web. Can also be a path to the json file
* `rendererSettings`: See [wiki](https://github.com/airbnb/lottie-web/wiki/Renderer-Settings). You can also pass the canvas directly instead of this argument. This is recommended unless you want to set `preserveAspectRatio`)
* `options`: Any **other** options you want to pass to 
Lottie's [loadAnimation()](https://github.com/airbnb/lottie-web/wiki/loadAnimation-options). Apart from `assetsPath`, most of these doesn't make sense for rendering animations on the server.

To render to a file, call `goToAndStop()` on the animation object. This renders a frame which is ready on the next "tick". use [`canvas.toBuffer()`](https://github.com/Automattic/node-canvas#canvastobuffer). Save the buffer directly to a file or piped them to ffmpeg to create a video (see [Examples](#examples)).

## Examples

The [examples-directory](https://github.com/friday/lottie-node/blob/master/examples) contains two working examples which renders an animation from [lottie-react-native](https://github.com/react-community/lottie-react-native) to PNG and full video.


Make sure you have ffmpeg (see [Rendering to video](#rendering-to-video) below). Then run the examples in node:

```sh
cd examples
yarn # (or 'npm i')
node render-png.js
node render-mp4.js # This takes a little while (~10s on my laptop)
```

## Rendering to video

If you want to render to video you need `ffmpeg`. Use a package manager or the official [compilation guide](https://trac.ffmpeg.org/wiki/CompilationGuide) for how to compile it on your platform. Package managers tends to ship older versions and can't be customized, but they are significantly easier to install.

## How it works

Lottie wasn't written to support rendering in Node.js. Node-canvas and jsdom has [some](https://github.com/Automattic/node-canvas/issues/487) [quirks](https://github.com/jsdom/jsdom/issues/2067) when used together, and for some reason Lottie occasionally frame skips when running scripts in the [recommended jsdom way](https://github.com/jsdom/jsdom/wiki/Don't-stuff-jsdom-globals-onto-the-Node-global#running-code-inside-the-jsdom-context). Because of these challenges, while writing lottie-node I had to resort to some hacky methods that are generally discouraged. Rather than importing lottie-web as a module, it's loaded as a string, patched to work server-side, and then run using [eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval).

This type of solution is risky and can break with the upgrade of any of the peer dependencies, but at least the module is isolated and doesn't add dom-shims to the global scope.

If you are having trouble, try the [examples](#examples). They have their own package.json and yarn lockfile, so they won't use potentially incompatible peer-dependencies in the future.

SVG and HTML are not supported and can not be supported in Node.js as far as I know of. Even if it would be possible, these renderers aren't suited for exporting independent images or video files, so it's outside the scope of this project.
