const utils = require("../utils");

function plotMesh3D({
                        params: {outputId, x, y, z, i, j, k, name, color, faceColor},
                        context: {bundle},
                        sendToOutputAndWaitForResult,
                    }) {
    const trace = {
        x, y, z, i, j, k, name,
        color: utils.intToRGBA(color),
        facecolor: faceColor ? faceColor.map(utils.intToRGBA) : undefined,
        type: "mesh3d",
        colorscale: "Picnic"
    };

    sendToOutputAndWaitForResult({
        function: "plotMesh3D",
        trace, outputId
    });
}

module.exports = plotMesh3D;
