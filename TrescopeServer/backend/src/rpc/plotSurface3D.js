function plotSurface3D({
                           params: {outputId, intensity, name},
                           context: {bundle},
                           sendToOutputAndWaitForResult,
                       }) {
    const trace = {
        name,
        z: intensity,
        type: "surface",
        contours: {
            z: {
                show: true,
                usecolormap: true,
                highlightcolor: "#42f462",
                project: {z: true},
            },
        },
    };

    sendToOutputAndWaitForResult({
        function: "plotSurface3D",
        trace, outputId
    });
}

module.exports = plotSurface3D;
