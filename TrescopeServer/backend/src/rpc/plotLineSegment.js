const utils = require("../utils");

function plotLineSegment({
                             params: {outputId, x, y, i, j, name, color, width},
                             context: {bundle},
                             sendToOutputAndWaitForResult,
                         }) {
    const Xe = [], Ye = [];
    for (let iii = 0; iii < i.length; iii++) {
        const T = [[x[i[iii]], y[i[iii]]], [x[j[iii]], y[j[iii]]]];
        Xe.push(...[0, 1].map(k => T[k][0]), NaN);
        Ye.push(...[0, 1].map(k => T[k][1]), NaN);
    }
    const trace = {
        type: "scatter2d",
        mode: "lines",
        marker: {color: utils.intToRGBA(color)},
        line: {width},
        x: Xe,
        y: Ye,
        name,
        connectgaps: false,
    };

    sendToOutputAndWaitForResult({
        function: "plotLineSegment",
        trace, outputId
    });
}

module.exports = plotLineSegment;
