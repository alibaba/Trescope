function plotImage({
                       params: {
                           filePath, outputId,
                           enumeration
                       },
                       context: {bundle},
                       sendToOutputAndWaitForResult,
                   }) {
    const trace = {remoteOrLocalPath: filePath};
    sendToOutputAndWaitForResult({function: "plotImage", trace, outputId});
}

module.exports = plotImage;
