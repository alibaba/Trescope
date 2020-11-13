function addControl({
                        params: {
                            id, label, type, value, outputId,
                            enumeration
                        },
                        context: {bundle},
                        sendToOutputAndWaitForResult,
                    }) {
    const trace = {id, label, type, value, enumeration};
    sendToOutputAndWaitForResult({function: "addControl", trace, outputId});
}

module.exports = addControl;
