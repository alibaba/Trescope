const utils = require("../utils");


const plotlyLayoutTemplate = {
    showlegend: true, legend: {orientation: "h"},
    yaxis: {scaleanchor: 'x', scaleratio: 1},//keep x , y equal ratio when 2d
    margin: {l: 60, r: 60, t: 80, b: 60},
    hoverlabel: {
        namelength: -1
    },
    scene: {
        aspectmode: "data",
        camera: {up: {x: 0, y: 1, z: 0}, projection: {type: 'perspective'}},
        ...utils.miscs.TemplateSceneXYZAxis
    },
};

function initializeOutput({
                              params: {
                                  outputId,
                                  rowStart, columnStart, rowSpan, columnSpan,
                              },
                              heteroSession,
                              displaySession,
                              context: {bundle},
                              sendToOutputAndWaitForResult,
                          }) {

    const output = {
        gridLayout: {
            rowStart, columnStart, rowSpan, columnSpan,
            size: {width: 0, height: 0},
        },
        gridRenderer: {
            rendererType: "plotly",
            trescopeItemRenderer: {
                data: [],
                version: utils.makeRandomString(5),
                layout: plotlyLayoutTemplate,
                layoutSnapshot: plotlyLayoutTemplate
            },
        },
    };

    sendToOutputAndWaitForResult({
        function: "initializeOutput",
        resolutionRow: bundle.get('resolutionRow'),
        resolutionColumn: bundle.get('resolutionColumn'),
        directory: bundle.get('directory'),
        widthPixel: bundle.get('widthPixel'),
        heightPixel: bundle.get('heightPixel'),
        outputId, output,
    });
}

module.exports = initializeOutput;
