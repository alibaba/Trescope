const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const {app, BrowserWindow, ipcMain, screen} = require('electron');
const {spawn, exec} = require('child_process');

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
    'plotWireframe3D',
    'plotAxisHelper3D',
    'plotLineSegment',
    'plotPie',
];
const sceneRendererSupportFunctions = ['plotFRONT3D'];


const debug = false;
const plotDataCache = new Map();
let targetDirectory, maxHeightPixel = 0, maxWidthPixel = 0;
let window = null, didFinishLoad = false, currentFinishCallback = null;

function blenderRender(context, funcKey, funcParam, serverHost, callback) {
    if ('trescope.scene.createScene' !== funcKey) return false;
    const {data: [{renderer}]} = funcParam;
    if ('blender' !== renderer) return false;
    const {contextPath} = context.get('defaultArgs');
    const blenderPath = context.get('blenderPath');

    const finalTargetDirectory = path.join(targetDirectory, `trescope-plot`);
    if (!fs.existsSync(finalTargetDirectory)) mkdirp.sync(finalTargetDirectory);

    const {outputId} = funcParam;
    const args = {...funcParam, outputFile: path.join(finalTargetDirectory, `${outputId}.png`)};
    const cmd = `${blenderPath} --background --python ${path.join(contextPath, 'blender', 'blender_front3d.py')} -- '${JSON.stringify(args)}'`;

    const childProcess = spawn(cmd, [], {shell: true, stdio: 'inherit'});
    childProcess.on('error', data => console.error(`trescope.blender.render.fail: ${data}`));
    childProcess.on('exit', code => {
        console.log(`trescope.blender.render.exit.withCode[${code}]`);
        callback();
    });

    // exec(cmd, (error, stdout, stderr) => {
    //     callback();
    //
    //     if (error) {
    //         console.error(`trescope.blender.render.fail: ${error}`);
    //         return;
    //     }
    //     console.log(`trescope.blender.render: ${stdout}`);
    //     if (stderr) console.error(`trescope.blender.render.stderror: ${stderr}`);
    // });
    return true;
}

function tryToInitEnvAndRun(context, funcKey, funcParam, serverHost, finishCallback) {
    if (currentFinishCallback) throw new Error('Pending plot has not finished');
    currentFinishCallback = finishCallback;

    if (blenderRender(context, funcKey, funcParam, serverHost, () => {
        currentFinishCallback();
        currentFinishCallback = null;
    })) return;

    const pendingOperation = () => {
        const factor = screen.getPrimaryDisplay().scaleFactor;
        const newWidth = maxWidthPixel / factor, newHeight = maxHeightPixel / factor;
        const [oldWidth, oldHeight] = window.getContentSize();
        if (newWidth !== oldWidth || newHeight !== oldHeight) window.setContentSize(newWidth, newHeight);
        window.webContents.send(funcKey, {...funcParam, serverHost})
    };
    if (window && didFinishLoad) {
        pendingOperation();
    } else {
        const readyCallback = () => {
            const factor = screen.getPrimaryDisplay().scaleFactor;
            ipcMain.removeHandler('capturePage');
            ipcMain.handle('capturePage', (evidence, {outputId, width, height}) => {
                window.webContents.capturePage({x: 0, y: 0, width, height}).then(image => {
                    const finalTargetDirectory = path.join(targetDirectory, `trescope-plot`);
                    if (!fs.existsSync(finalTargetDirectory)) mkdirp.sync(finalTargetDirectory);
                    fs.writeFileSync(path.join(finalTargetDirectory, `${outputId}.png`), image.toPNG());
                    currentFinishCallback();
                    currentFinishCallback = null;
                });
            });

            window = new BrowserWindow({
                show: debug,
                useContentSize: true,
                width: maxWidthPixel / factor,
                height: maxHeightPixel / factor,
                webPreferences: {webSecurity: false, offscreen: true, nodeIntegration: true}
            });
            if (debug) window.openDevTools({mode: 'detach'});

            window.webContents.on('did-finish-load', () => {
                didFinishLoad = true;
                pendingOperation();
            });
            window.loadURL(`file://${path.resolve(`${__dirname}/renderer.html`)}`);
        };
        app.allowRendererProcessReuse = true;
        if (app.isReady()) readyCallback();
        else app.on("ready", readyCallback);
    }
}


function send(context, newData, serverHost, reportFinishToHetero) {
    const {token} = newData;
    if ('initializeOutput' === newData['function']) {
        const {
            directory, widthPixel, heightPixel, outputId,
            output: {
                gridRenderer: {
                    trescopeItemRenderer: {data, layout},
                },
            },
        } = newData;
        targetDirectory = directory;
        maxWidthPixel = widthPixel > maxWidthPixel ? widthPixel : maxWidthPixel;
        maxHeightPixel = heightPixel > maxHeightPixel ? heightPixel : maxHeightPixel;
        plotDataCache.set(outputId, {data, layout, rendererType: null, widthPixel, heightPixel});
        reportFinishToHetero({token, success: true});
        return;
    }

    if ('updateLayout' === newData['function']) {
        const {outputId} = newData;
        let cacheData = plotDataCache.get(outputId);
        cacheData['layout'] = {...cacheData['layout'], ...newData['layout']};
        reportFinishToHetero({token, success: true});
        return;
    }

    if ('resetPlot' === newData['function']) {
        plotDataCache.clear();
        maxHeightPixel = 0, maxWidthPixel = 0;
        window = null;
        didFinishLoad = false;
        currentFinishCallback = null;
        reportFinishToHetero({token, success: true});
        return;
    }

    if ('flushOutput' === newData['function']) {
        const {outputId} = newData;
        let {data, layout, rendererType, widthPixel, heightPixel} = plotDataCache.get(outputId);
        plotDataCache.delete(outputId);
        const funcKey = {
            'plotly': 'trescope.plotly.newPlot',
            'scene': 'trescope.scene.createScene'
        }[rendererType];
        tryToInitEnvAndRun(context, funcKey, {
            data,
            layout,
            outputId,
            factor: screen.getPrimaryDisplay().scaleFactor,
            width: widthPixel,
            height: heightPixel,
        }, serverHost, () => reportFinishToHetero({token, success: true}));
        return;
    }

    let rendererType = null;
    if (-1 !== plotlyRendererSupportFunctions.indexOf(newData['function']))
        rendererType = 'plotly';
    if (-1 !== sceneRendererSupportFunctions.indexOf(newData['function']))
        rendererType = 'scene';
    if (null === rendererType) {
        reportFinishToHetero({token, success: false});
        return;
    }
    const {outputId} = newData;
    let cacheData = plotDataCache.get(outputId);
    cacheData['data'] = [...cacheData['data'], newData['trace']];
    cacheData['layout'] = {...cacheData['layout'], ...newData['layout']};
    cacheData['rendererType'] = rendererType;
    reportFinishToHetero({token, success: true});
}

module.exports = {send};
