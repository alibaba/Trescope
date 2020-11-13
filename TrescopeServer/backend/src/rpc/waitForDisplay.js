const network = require('../network');

function waitForDisplay({token, heteroSession, displaySession, context: {displayEndpoint}}) {
    const callback = () => {
        displayEndpoint.removeListener(callback);
        heteroSession.send({success: true, token});
    };
    displayEndpoint.on(network.Event.CONNECT, callback);
}

module.exports = waitForDisplay;