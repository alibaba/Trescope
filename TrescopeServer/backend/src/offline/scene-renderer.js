const mkdirp = require('mkdirp');
const gl = require("gl");
const THREE = require("three");
const fs = require("fs");
const PNG = require("pngjs").PNG;
const path = require("path");
const utils = require("../utils");
const sceneCreator = require("scene-json-renderer");

function toImageFile(pixels, width, height, filePath) {
    const png = new PNG({width, height, filterType: 4});
    for (let index = 0; index < pixels.length / 4; index++) {
        let rowId = Math.floor(index / width);
        const columnId = index % width;
        rowId = height - rowId - 1;

        const new_index = rowId * width + columnId;
        png.data[index * 4] = pixels[new_index * 4];
        png.data[index * 4 + 1] = pixels[new_index * 4 + 1];
        png.data[index * 4 + 2] = pixels[new_index * 4 + 2];
        png.data[index * 4 + 3] = pixels[new_index * 4 + 3];
    }
    png.pack().pipe(fs.createWriteStream(filePath));
}

async function plot({data, layout}, outputId, width, height, directory, renderer, serverHost) {
    const trace = data[0];
    const {houseLayoutFile, shapeLocalSource, shapeRemoteSource, view, unit, hiddenMeshes, renderType} = trace;

    const {scene, camera, loadingPromises} = await sceneCreator.createScene(houseLayoutFile,
        shapeLocalSource, shapeRemoteSource,
        view, layout.scene.camera, width / height,
        unit, hiddenMeshes, renderType,
        serverHost);
    await Promise.all(loadingPromises);

    renderer.render(scene, camera);
    const pixels = new Uint8Array(width * height * 4);
    const context = renderer.getContext();
    context.readPixels(0, 0, width, height, context.RGBA, context.UNSIGNED_BYTE, pixels);
    if (!fs.existsSync(directory)) mkdirp.sync(directory);
    toImageFile(pixels, width, height, path.join(directory, `${outputId}.png`));
}

function runSceneTaskRecursiveOneByOne(renderer, serverHost, tasks, index, targetDirectory, imageWidthPixel, imageHeightPixel, callback) {
    if (index >= tasks.length) {
        callback();
        return;
    }
    const {outputId, plotData} = tasks[index];
    plot(plotData, outputId, imageWidthPixel, imageHeightPixel, targetDirectory, renderer, serverHost)
        .then(() => runSceneTaskRecursiveOneByOne(renderer, serverHost, tasks, ++index, targetDirectory, imageWidthPixel, imageHeightPixel, callback));
}

function run(tasks, targetDirectory, imageWidthPixel, imageHeightPixel, serverHost, callback) {
    const glContext = gl(imageWidthPixel, imageHeightPixel, {preserveDrawingBuffer: true});
    const fakeCanvas = {
        style: {width: imageWidthPixel, height: imageHeightPixel}, width: imageWidthPixel, height: imageHeightPixel,
        addEventListener: utils.miscs.noop, removeEventListener: utils.miscs.noop,
    };
    const renderer = new THREE.WebGLRenderer({canvas: fakeCanvas, context: glContext});
    renderer.autoClear = true;
    renderer.setSize(imageWidthPixel, imageHeightPixel);
    runSceneTaskRecursiveOneByOne(renderer, serverHost, tasks, 0, targetDirectory, imageWidthPixel, imageHeightPixel, callback);
}

module.exports = {run};
