function plotGraph({
                       params: {
                           name, outputId,
                           vertex, link, edge,
                           vertexDescription, edgeDescription, vertexSize, edgeWidth, vertexColor, edgeColor, vertexOpacity, edgeOpacity
                       },
                       context: {bundle},
                       sendToOutputAndWaitForResult,
                   }) {
    const trace = {
        name,
        vertex: {
            data: vertex,
            description: vertexDescription,
            size: vertexSize,
            color: vertexColor,
            opacity: vertexOpacity
        },
        link,
        edge: {
            data: edge,
            description: edgeDescription,
            color: edgeColor,
            width: edgeWidth,
            opacity: edgeOpacity
        },
        type: 'graph'
    };

    sendToOutputAndWaitForResult({
        function: "plotGraph",
        trace, outputId
    });
}

module.exports = plotGraph;
