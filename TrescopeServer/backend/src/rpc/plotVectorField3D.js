const utils = require("../utils");

function plotVectorField3D({
                               params: {
                                   outputId, x,
                                   y,
                                   z,
                                   locationX,
                                   locationY,
                                   locationZ,
                                   name,
                                   sizeFactor,
                                   autoScaleByLocation,
                                   colorScale,
                                   anchor,
                               },
                               context: {bundle},
                               sendToOutputAndWaitForResult,
                           }) {
    colorScale = colorScale.map((intensityColorPair) => [
        intensityColorPair[0],
        utils.intToRGBA(intensityColorPair[1]),
    ]);
    const trace = {
        type: "cone",
        name,
        sizeref: sizeFactor,
        sizemode: "scaled",
        trescope_autoscale: autoScaleByLocation,
        colorscale: colorScale,
        showscale: false,
        x: locationX,
        y: locationY,
        z: locationZ,
        u: x,
        v: y,
        w: z,
        anchor,
    };

    sendToOutputAndWaitForResult({
        function: "plotVectorField3D",
        trace, outputId
    });
}

module.exports = plotVectorField3D;
