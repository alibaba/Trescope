function flushOutput({
                         params: {outputId},
                         context: {bundle},
                         token,
                         heteroSession,
                         displaySession,
                         sendToOutputAndWaitForResult,
                     }) {
    sendToOutputAndWaitForResult({function: "flushOutput", outputId});
}

module.exports = flushOutput;
