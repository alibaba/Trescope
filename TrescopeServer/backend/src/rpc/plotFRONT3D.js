function plotFRONT3D({
                         params: {
                             filePath,
                             shapeLocalSource,
                             shapeRemoteSourceObj,
                             shapeRemoteSourceTexture,
                             view,
                             unit,
                             perspective,
                             name,
                             outputId,
                             hiddenMeshes,
                             renderType
                         },
                         context: {bundle},
                         sendToOutputAndWaitForResult,
                     }) {
    const shapeRemoteSource = {
        objUrls: shapeRemoteSourceObj,
        textureUrls: shapeRemoteSourceTexture,
    };
    const trace = {
        type: 'front3d',
        houseLayoutFile: filePath,
        shapeLocalSource, shapeRemoteSource,
        view, unit, perspective, hiddenMeshes,
        renderType
    };
    sendToOutputAndWaitForResult({function: 'plotFRONT3D', trace, outputId});
}

module.exports = plotFRONT3D;
