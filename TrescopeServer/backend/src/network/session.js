const WebSocket = require('ws');

class Session {
    constructor(core) {
        this._send = core instanceof WebSocket ? core.send.bind(core) : core.write.bind(core);
    }

    send(data) {
        this._send(JSON.stringify(data));
    }
}

module.exports = Session;