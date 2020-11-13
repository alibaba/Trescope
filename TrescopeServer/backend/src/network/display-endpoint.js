const WebSocket = require('ws');
const event = require('./event-define');
const Session = require('./session');

class DisplayEndpoint {
    constructor(httpServer) {
        this._httpServer = httpServer;
        this._listeners = new Map();
        this._websocketServer = new WebSocket.Server({server: httpServer});
        this._displaySession = null;
        this._initialize(this._websocketServer);
    }

    on(eventName, callback) {
        let callbacks = this._listeners.get(eventName);
        callbacks = callbacks != null ? callbacks : [];
        callbacks.push(callback);
        this._listeners.set(eventName, callbacks);
    }

    removeListener(callback) {
        for (let [key, value] of this._listeners) {
            const index = value.indexOf(callback);
            if (index > -1) value.splice(index, 1);
        }
    }

    removeListeners(eventName) {
        this._listeners.delete(eventName);
    }

    listen(port) {
        this._httpServer.listen(port);
    }

    connected() {
        return this._displaySession != null;
    }

    _safeGetListeners(key) {
        return null != this._listeners.get(key) ? this._listeners.get(key) : [() => {
        }];
    }

    _initialize(server) {
        server.on('error', error => console.error('Trescope.server.DisplayEndpoint.error', error));
        // server.on('listening', () => console.log('Trescope.server.DisplayEndpoint.listening...'));
        // server.on('close', () => console.log('Trescope.server.DisplayEndpoint.close'));

        server.on('connection', (socket, request) => {
            const ip = request.socket.remoteAddress;

            if (null !== this._displaySession) {//Only unique connection can be accepted here
                console.error(`Trescope.client.MultiDisplaySession.ip{${ip}}`);
                return;
            }
            const session = new Session(socket);
            this._displaySession = session;

            this._safeGetListeners(event.CONNECT).forEach(callback => callback(({session, ip})));
            socket.on('message', (message) =>
                this._safeGetListeners(event.MESSAGE).forEach(callback => callback(({
                    message: JSON.parse(message),
                    session, ip
                }))));
            socket.on('close', () => {
                this._displaySession = null;
                this._safeGetListeners(event.DISCONNECT).forEach(callback => callback(({session, ip})));
            });
        });
    }
}

module.exports = DisplayEndpoint;