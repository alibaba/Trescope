const net = require('net');
const event = require('./event-define');
const Session = require('./session');

function tryParse(type, data) {
    try {
        if ('boolean' === type) {
            if ('True' === data) return true;
            if ('False' === data) return false;
        }
        if ('null' === type && 'None' === data) return null;

        if ('string' === type) return data;
        if ('number' === type) return Number(data);
        if ('array' === type) return eval(data);
        console.warn(`Trescope eval data: ${data} for type: ${type}`);
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
        const type = keyValue[1];
        const value = keyValue[2];
        if ('function' === key) remoteFuncName = value;
        else if ('token' === key) token = Number(value);
        else remoteFuncParams[key] = tryParse(type, value);
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
        this.pid = -1;
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

    _initializeSession(socket, ip, pid) {
        const session = new Session(socket);
        this._heteroLangSession = session;

        const onSocketDisconnect = (errorMaybe) => {
            if (errorMaybe && 'ECONNRESET' !== errorMaybe.code) console.error('Trescope.server.HeteroLangEndpoint.error', errorMaybe);

            this._heteroLangSession = null;
            this._safeGetListeners(event.DISCONNECT).forEach(callback => callback({session, ip, pid}));
        };

        this._safeGetListeners(event.CONNECT).forEach(callback => callback({session, ip, pid}));
        let dataBuffer = '';
        socket.on('data', data => {
            dataBuffer += data.toString();
            if (!dataBuffer.includes("EOF")) return;
            this._safeGetListeners(event.MESSAGE).forEach(callback => callback({
                ...parseHeteroData(dataBuffer), session, ip, pid
            }));
            dataBuffer = '';
        });
        socket.on('error', onSocketDisconnect);
        socket.on('end', onSocketDisconnect);
    }

    _handshake(socket, data) {
        try {
            const {remoteFuncName, remoteFuncParams: {identifier, pid}, token} = parseHeteroData(data.toString());
            if ('heteroHandshake' !== remoteFuncName) return {success: false, pid};

            const success = this._identifier === identifier;
            socket.write(JSON.stringify({success, token}));
            return {success, pid};
        } catch (e) {
            return false;
        }
    }

    _create() {
        let _pid;
        return net.createServer(socket => {
            const ip = socket.remoteAddress;
            if (null !== this._heteroLangSession) {//Only unique connection can be accepted here
                console.error(`Trescope.client.MultiHeteroLanguageEndpoint.ip{${ip}}, pid ${_pid} has connected already`);
                new Session(socket).send({
                    success: false,
                    info: `Backend ${this._identifier} has been occupied by process ${_pid}`
                });
                return;
            }

            socket.on('data', data => {
                const {success, pid} = this._handshake(socket, data);
                if (!success) return;

                socket.removeAllListeners();
                _pid = pid;
                this._initializeSession(socket, ip, pid);
            });
        });
    }
}

module.exports = HeteroLanguageEndpoint;
