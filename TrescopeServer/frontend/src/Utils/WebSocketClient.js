import {w3cwebsocket as W3CWebSocket} from "websocket";

class WebSocketClient {
    constructor(uri) {
        this._alive = false;
        this.eventListeners = [];
        this.functionListeners = {};
        this.coreClient = new W3CWebSocket(uri);
        this.coreClient.onopen = () => {
            this._alive = true;
            this.eventListeners.forEach(listener => listener("open"));
        };
        this.coreClient.onmessage = message => {
            const command = JSON.parse(message.data);
            console.log(`event[message] comes, call function[${command.function}]`);
            const {token, src} = command;
            const finish = result => this.coreClient.send(JSON.stringify({token, src, ...result}));

            this.eventListeners.forEach(listener => listener("message", message));

            const theFunctionListener = this.functionListeners[command.function];
            if (theFunctionListener) theFunctionListener(command, finish);
            else finish();//Ignore the command if no listener registered.
        };
        this.coreClient.onerror = () => {
            this._alive = false;
            this.eventListeners.forEach(listener => listener("error"));
        };
        this.coreClient.onclose = () => {
            this._alive = false;
            this.eventListeners.forEach(listener => listener("close"));
        };

        this.addEventListener((event, params) => 'message' !== event && console.log(`event[${event}] comes`));
    }

    alive() {
        return this._alive;
    }

    addEventListener(listener) {
        this.eventListeners.push(listener);
    }

    setFunctionListener(functionName, listener) {
        this.functionListeners[functionName] = listener;
    }

    setMultipleFunctionListeners(functionNames, listener) {
        functionNames.forEach(value => {
            this.functionListeners[value] = listener;
        });
    }
}

export default WebSocketClient;
