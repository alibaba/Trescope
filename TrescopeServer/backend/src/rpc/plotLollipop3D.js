const utils = require("../utils");

function plotLollipop3D({
                            params: {
                                outputId,
                                x,
                                y,
                                z,
                                name,
                                headSize,
                                tailSize,
                                lineWidth,
                                color,
                                locationX,
                                locationY,
                                locationZ
                            },
                            context: {bundle},
                            sendToOutputAndWaitForResult,
                        }) {
    let newX = [];
    let newY = [];
    let newZ = [];
    for (let i = 0; i < x.length; i++) {
        newX.push(locationX[i], locationX[i] + x[i], NaN);
        newY.push(locationY[i], locationY[i] + y[i], NaN);
        newZ.push(locationZ[i], locationZ[i] + z[i], NaN);
    }
    let symbol = [];
    let size = [];
    for (let i = 0; i < x.length; i++)
        symbol.push("cross", "circle", NaN);
    for (let i = 0; i < x.length; i++)
        size.push(tailSize, headSize, NaN);

    const trace = {
        type: "scatter3d",
        mode: "lines+markers",
        marker: {size, symbol, color: utils.intToRGBA(color)},
        x: newX,
        y: newY,
        z: newZ,
        name,
        connectgaps: false,
    };

    sendToOutputAndWaitForResult({
        function: "plotLollipop3D",
        trace, outputId
    });
}

module.exports = plotLollipop3D;
