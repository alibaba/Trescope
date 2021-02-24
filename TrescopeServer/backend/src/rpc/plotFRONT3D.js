function plotFRONT3D({
                         params: {
                             filePath,
                             shapeLocalSource,
                             shapeRemoteSourceObj,
                             shapeRemoteSourceTexture,
                             view,
                             unit,
                             name,
                             outputId,
                             hiddenMeshes,
                             renderType,
                             renderer,
                             sampleCount,
                             baseLightStrength
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
        view, unit, hiddenMeshes,
        renderType, renderer, sampleCount, baseLightStrength
    };
    sendToOutputAndWaitForResult({function: 'plotFRONT3D', trace, outputId});
}

module.exports = plotFRONT3D;
