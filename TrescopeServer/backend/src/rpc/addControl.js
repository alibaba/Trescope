const utils = require("../utils");

function addControl({
                        params: {
                            id, label, type, value, outputId,
                            enumeration, style,
                            attachOutput, colorWhenPicked,
                            openIfLink
                        },
                        context: {bundle},
                        sendToOutputAndWaitForResult,
                    }) {
    const trace = {
        id,
        label,
        type,
        value,
        enumeration,
        style,
        attachOutput,
        openIfLink,
        colorWhenPicked: utils.intToRGBA(colorWhenPicked),
    };
    sendToOutputAndWaitForResult({function: "addControl", trace, outputId});
}

module.exports = addControl;
