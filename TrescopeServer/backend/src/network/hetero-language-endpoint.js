const net = require('net');
const event = require('./event-define');
const Session = require('./session');

function tryParse(data) {
    try {
        if ('True' === data) return true;
        if ('False' === data) return false;
        if ('None' === data) return null;
        return eval(data);
    } catch (e) {
        return data;
    }
}

function parseHeteroData(hetero) {
    const lines = hetero.match(/[^\n]+/g);
    const remoteFuncParams = {};
    let remoteFuncName = null, token = -1;

    lines.some(line => {
        if ('EOF' === line) return true;

        const keyValue = line.split('¥爨¥');
        const key = keyValue[0];
        const value = keyValue[1];
        if ('function' === key) remoteFuncName = value;
        else if ('token' === key) token = Number(value);
        else remoteFuncParams[key] = tryParse(value);
        return false;
    });
    return {remoteFuncName, remoteFuncParams, token};
}

class HeteroLanguageEndpoint {
    constructor(identifier) {
        this._identifier = identifier;
        this._heterSocketServer = this._create();
        this._listeners = new Map();
        this._heteroLangSession = null;
    }

    on(eventName, callback) {
        let callbacks = this._listeners.get(eventName);
        callbacks = callbacks != null ? callbacks : [];
        callbacks.push(callback);
        this._listeners.set(eventName, callbacks);
    }

    listen(port) {
        this._heterSocketServer.listen(port);
    }

    _safeGetListeners(key) {
        return null != this._listeners.get(key) ? this._listeners.get(key) : [() => {
        }];
    }

    _initializeSession(socket, ip) {
        const session = new Session(socket);
        this._heteroLangSession = session;

        const onSocketDisconnect = (errorMaybe) => {
            if (errorMaybe && 'ECONNRESET' !== errorMaybe.code) console.error('Trescope.server.HeteroLangEndpoint.error', errorMaybe);

            this._heteroLangSession = null;
            this._safeGetListeners(event.DISCONNECT).forEach(callback => callback({session, ip}));
        };

        this._safeGetListeners(event.CONNECT).forEach(callback => callback({session, ip}));
        let dataBuffer = '';
        socket.on('data', data => {
            dataBuffer += data.toString();
            if (!dataBuffer.includes("EOF")) return;
            this._safeGetListeners(event.MESSAGE).forEach(callback => callback({
                ...parseHeteroData(dataBuffer), session, ip
            }));
            dataBuffer = '';
        });
        socket.on('error', onSocketDisconnect);
        socket.on('end', onSocketDisconnect);
    }

    _handshake(socket, data) {
        try {
            const {remoteFuncName, remoteFuncParams: {identifier}, token} = parseHeteroData(data.toString());
            if ('heteroHandshake' !== remoteFuncName) return false;

            const success = this._identifier === identifier;
            socket.write(JSON.stringify({success, token}));
            return success;
        } catch (e) {
            return false;
        }
    }

    _create() {
        return net.createServer(socket => {
            const ip = socket.remoteAddress;
            if (null !== this._heteroLangSession) {//Only unique connection can be accepted here
                console.error(`Trescope.client.MultiHeteroLanguageEndpoint.ip{${ip}}`);
                return;
            }

            socket.on('data', data => {
                if (!this._handshake(socket, data)) return;

                socket.removeAllListeners();
                this._initializeSession(socket, ip);
            });
        });
    }
}

module.exports = HeteroLanguageEndpoint;