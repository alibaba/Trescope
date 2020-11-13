function plotHeatMap({
                         params: {intensity, useGL, colorScale, name, outputId},
                         context: {bundle},
                         sendToOutputAndWaitForResult,
                     }) {
    const trace = {
        name,
        z: intensity,
        colorscale: colorScale,
        type: useGL ? "heatmapgl" : "heatmap",
    };

    sendToOutputAndWaitForResult({
        function: "plotHeatMap",
        trace, outputId
    });
}

module.exports = plotHeatMap;
