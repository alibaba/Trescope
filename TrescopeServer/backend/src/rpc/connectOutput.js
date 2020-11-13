function connectOutput({
                           params: {
                               outputType, directory,
                               resolutionRow, resolutionColumn,
                               heightPixel, widthPixel,
                           },
                           token,
                           heteroSession,
                           displaySession,
                           context: {bundle, displayEndpoint},
                       }) {
    if ("display" === outputType && !displayEndpoint.connected()) {
        heteroSession.send({success: false, token});
        return;
    }

    bundle.set("outputType", outputType);
    bundle.set('directory', directory);
    bundle.set('widthPixel', widthPixel);
    bundle.set('heightPixel', heightPixel);
    bundle.set('resolutionRow', resolutionRow);
    bundle.set('resolutionColumn', resolutionColumn);
    heteroSession.send({success: true, token});
}

module.exports = connectOutput;
