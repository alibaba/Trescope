const utils = require("../utils");

function plotViolin({
                        params: {
                            outputId, x,
                            color,
                            name,
                            useUniformScale,
                            useUniformAxis,
                        },
                        context: {bundle},
                        sendToOutputAndWaitForResult,
                    }) {
    color = utils.intToRGBA(color);
    useUniformAxis = useUniformAxis;
    const trace = {
        x,
        name,
        scalegroup: useUniformScale
            ? "base"
            : name,
        y0: useUniformAxis ? "base" : name,
        hoveron: "points+kde",
        type: "violin",
        points: "all",
        jitter: 0,
        marker: {
            symbol: "line-ns",
            color,
            line: {width: useUniformAxis ? 0 : 1, color},
        },
    };
    const layout = {
        xaxis: {
            title: "",
            showgrid: true,
            // showspikes: true, spikemode: 'toaxis', spikethickness: 1, spikedash: 'dot', spikecolor: 'rgba(0,0,0,.5)'
        },
        yaxis: {title: "", showgrid: true},
    };

    sendToOutputAndWaitForResult({
        function: "plotViolin",
        trace, layout, outputId
    });
}

module.exports = plotViolin;
