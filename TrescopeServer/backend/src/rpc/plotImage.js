function plotImage({
                       params: {filePath, outputId,},
                       context: {bundle},
                       sendToOutputAndWaitForResult,
                   }) {
    const trace = {remoteOrLocalPath: filePath};
    sendToOutputAndWaitForResult({function: "plotImage", trace, outputId});
}

module.exports = plotImage;
