const utils = require("../utils");

function plotAxisHelper3D({
                              params: {outputId, name, width, axisLength},
                              context: {bundle},
                              sendToOutputAndWaitForResult,
                          }) {
    const Xe = [0, axisLength, NaN, 0, 0, NaN, 0, 0, NaN],
        Ye = [0, 0, NaN, 0, axisLength, NaN, 0, 0, NaN],
        Ze = [0, 0, NaN, 0, 0, NaN, 0, axisLength, NaN];
    const trace = {
        type: "scatter3d",
        mode: "lines",
        line: {
            width,
            color: [0xffff0000, 0xffff0000, 0xffff0000, 0xff00ff00, 0xff00ff00, 0xff00ff00, 0xff0000ff, 0xff0000ff, 0xff0000ff,].map(utils.intToRGBA)
        },
        x: Xe,
        y: Ye,
        z: Ze,
        name,
        connectgaps: false,
    };

    sendToOutputAndWaitForResult({
        function: "plotAxisHelper3D",
        trace, outputId
    });
}

module.exports = plotAxisHelper3D;
