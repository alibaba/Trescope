function clearOutput({
                         params: {outputId},
                         context: {bundle},
                         sendToOutputAndWaitForResult,
                     }) {
    sendToOutputAndWaitForResult({function: "clearOutput", outputId});
}

module.exports = clearOutput;
