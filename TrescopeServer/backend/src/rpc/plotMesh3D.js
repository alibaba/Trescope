const utils = require("../utils");

function _fix(color, size, bundle) {
    let outputType = bundle.get("outputType");
    if (outputType === 'display') return undefined;

    const array = [];
    const c = utils.intToRGBA(color);
    for (let i = 0; i < size; i++) array.push(c);
    return array;
}

function plotMesh3D({
                        params: {outputId, x, y, z, i, j, k, u, v, texture, textureFlip, textureWrap, name, color, faceColor, flatShading},
                        displaySession,
                        context: {bundle},
                        sendToOutputAndWaitForResult,
                    }) {
    const trace = {
        x, y, z, i, j, k, name,
        texture: texture ? `http://${displaySession.host}/fetch?file=${texture}` : undefined, u, v,
        textureFlip, textureWrap,
        color: utils.intToRGBA(color),
        facecolor: faceColor ? faceColor.map(utils.intToRGBA) : _fix(color, i.length, bundle),
        type: "mesh3d",
        colorscale: "Picnic",
        flatshading: flatShading,
    };

    sendToOutputAndWaitForResult({
        function: "plotMesh3D",
        trace, outputId
    });
}

module.exports = plotMesh3D;
