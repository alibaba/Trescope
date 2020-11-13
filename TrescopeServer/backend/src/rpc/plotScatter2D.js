const utils = require("../utils");

function plotScatter2D({
                           params: {
                               x,
                               y,
                               name,
                               mode,
                               size,
                               color,
                               symbol,
                               useGL,
                               fill,
                               fillColor,
                               outputId
                           },
                           context: {bundle},
                           sendToOutputAndWaitForResult,
                       }) {
    const trace = {
        type: useGL ? "scattergl" : "scatter",
        mode: mode.join("+"),
        marker: {size, symbol, color: utils.intToRGBA(color)},
        fill: fill ? "toself" : "none",
        fillcolor: utils.intToRGBA(fillColor),
        x,
        y,
        name,
    };

    sendToOutputAndWaitForResult({
        function: "plotScatter2D",
        trace, outputId
    });
}

module.exports = plotScatter2D;
