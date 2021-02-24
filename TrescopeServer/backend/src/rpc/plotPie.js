function plotPie({
                     params: {
                         label, value, outputId,
                     },
                     context: {bundle},
                     sendToOutputAndWaitForResult,
                 }) {
    const trace = {
        values: value,
        labels: label,
        type: 'pie'
    };
    sendToOutputAndWaitForResult({function: "plotPie", trace, outputId});
}

module.exports = plotPie;
