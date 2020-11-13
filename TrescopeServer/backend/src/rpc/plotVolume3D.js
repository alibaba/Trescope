function plotVolume3D({
                          params: {
                              outputId, x,
                              y,
                              z,
                              value,
                              name,
                              opacity,
                              surfaceCount,
                              isoMin,
                              isoMax,
                          },
                          context: {bundle},
                          sendToOutputAndWaitForResult,
                      }) {
    const trace = {
        x,
        y,
        z,
        value,
        name,
        opacity,
        surface_count: surfaceCount,
        isomin: isoMin,
        isomax: isoMax,
        type: "volume",
    };

    sendToOutputAndWaitForResult({
        function: "plotVolume3D",
        trace, outputId
    });
}

module.exports = plotVolume3D;
