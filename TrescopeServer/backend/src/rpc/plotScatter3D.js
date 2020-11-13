const utils = require("../utils");

function plotScatter3D({
                           params: {outputId, x, y, z, name, mode, size, color, symbol},
                           context: {bundle},
                           sendToOutputAndWaitForResult,
                       }) {
    const trace = {
        type: "scatter3d",
        mode: mode.join("+"),
        marker: {
            size,
            symbol,
            color: utils.intToRGBA(color),
        },
        x,
        y,
        z,
        name,
    };

    sendToOutputAndWaitForResult({
        function: "plotScatter3D",
        trace, outputId
    });
}

module.exports = plotScatter3D;
