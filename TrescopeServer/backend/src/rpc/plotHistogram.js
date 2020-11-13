const utils = require("../utils");

function plotHistogram({
                           params: {outputId, x, color, xBinRange, name},
                           context: {bundle},
                           sendToOutputAndWaitForResult,
                       }) {
    const trace = {
        x,
        name,
        type: "histogram",
        marker: {color: utils.intToRGBA(color)},
        autobinx: !!xBinRange,
        xbins:
            xBinRange
                ? {
                    start: xBinRange[0],
                    end: xBinRange[1],
                    size: xBinRange[2],
                }
                : undefined,
    };
    const layout = {
        barmode: "overlay",
        xaxis: {title: ""},
        yaxis: {title: ""},
    };

    sendToOutputAndWaitForResult({
        function: "plotHistogram",
        trace, layout, outputId
    });
}

module.exports = plotHistogram;
