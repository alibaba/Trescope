const fs = require('fs');
const path = require('path');
const utils = require('../utils');
const mkdirp = require('mkdirp');
const sceneRenderer = require('./scene-renderer');
const orcaRenderer = require('./orca-renderer');


const plotlyRendererSupportFunctions = [
    'plotHeatMap',
    'plotHistogram',
    'plotLollipop3D',
    'plotMesh3D',
    'plotScatter2D',
    'plotScatter3D',
    'plotSurface3D',
    'plotVectorField3D',
    'plotViolin',
    'plotVolume3D',
];
const sceneRendererSupportFunctions = ['plotFRONT3D'];

const plotDataCache = new Map();
let targetDirectory, imageHeightPixel, imageWidthPixel;

function send(newData) {
    if ('initializeOutput' === newData['function']) {
        const {
            directory,
            widthPixel = 500,
            heightPixel = 500,
            outputId,
            output: {
                gridRenderer: {
                    trescopeItemRenderer: {data, layout},
                },
            },
        } = newData;
        targetDirectory = directory;
        imageWidthPixel = widthPixel;
        imageHeightPixel = heightPixel;
        plotDataCache.set(`${outputId}`, {data, layout, rendererType: null});
        return;
    }

    if ('updateLayout' === newData['function']) {
        const {outputId} = newData;
        let cacheData = plotDataCache.get(`${outputId}`);
        cacheData['layout'] = {...cacheData['layout'], ...newData['layout']};
        return;
    }

    let rendererType = null;
    if (-1 !== plotlyRendererSupportFunctions.indexOf(newData['function']))
        rendererType = 'plotly';
    if (-1 !== sceneRendererSupportFunctions.indexOf(newData['function']))
        rendererType = 'scene';
    if (null === rendererType) return;
    const {outputId} = newData;
    let cacheData = plotDataCache.get(`${outputId}`);
    cacheData['data'] = [...cacheData['data'], newData['trace']];
    cacheData['layout'] = {...cacheData['layout'], ...newData['layout']};
    cacheData['rendererType'] = rendererType;
}

function flush(serverHost) {
    const orcaRendererDataDir = path.join(targetDirectory, 'trescope-plot', 'raw-data');

    const sceneRendererTasks = [];
    Array.from(plotDataCache.entries()).forEach((element) => {
        const outputId = element[0];
        const plotData = element[1];
        if ('plotly' === plotData['rendererType']) {
            if (!fs.existsSync(orcaRendererDataDir)) mkdirp.sync(orcaRendererDataDir);
            fs.writeFileSync(path.join(orcaRendererDataDir, `${outputId}.json`), JSON.stringify(plotData));
            return;
        }
        if ('scene' === plotData['rendererType']) {
            sceneRendererTasks.push({outputId, plotData});
            return;
        }
    });
    plotDataCache.clear();
    const finalTargetDirectory = path.join(targetDirectory, `trescope-plot`);

    sceneRenderer.run(sceneRendererTasks, finalTargetDirectory, imageWidthPixel, imageHeightPixel, serverHost, () => {
        orcaRenderer.run(orcaRendererDataDir, finalTargetDirectory, imageWidthPixel, imageHeightPixel, () => {
            utils.getFiles(orcaRendererDataDir, '.json').forEach((filePath) => fs.unlinkSync(filePath, utils.miscs.noop));
            fs.rmdirSync(orcaRendererDataDir);
        });
    });
}

module.exports = {send, flush};
