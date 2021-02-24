const utils = require("../utils");

function plotWireframe3D({
                             params: {outputId, x, y, z, i, j, k, name, color, width},
                             context: {bundle},
                             sendToOutputAndWaitForResult,
                         }) {
    const Xe = [], Ye = [], Ze = [];
    for (let iii = 0; iii < i.length; iii++) {
        const T = [[x[i[iii]], y[i[iii]], z[i[iii]]], [x[j[iii]], y[j[iii]], z[j[iii]]], [x[k[iii]], y[k[iii]], z[k[iii]]]];
        Xe.push(...[0, 1, 2, 3].map(k => T[k % 3][0]), NaN);
        Ye.push(...[0, 1, 2, 3].map(k => T[k % 3][1]), NaN);
        Ze.push(...[0, 1, 2, 3].map(k => T[k % 3][2]), NaN);
    }
    const trace = {
        type: "scatter3d",
        mode: "lines",
        marker: {color: utils.intToRGBA(color),},
        line: {width},
        x: Xe,
        y: Ye,
        z: Ze,
        name,
        connectgaps: false,
    };

    sendToOutputAndWaitForResult({
        function: "plotWireframe3D",
        trace, outputId
    });
}

module.exports = plotWireframe3D;
