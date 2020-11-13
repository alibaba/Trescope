const PortScanner = require("portscanner");
const os = require("os");
const path = require('path');
const network = require("./network");
const rpc = require("./rpc");
const TrescopeException = require("./exception");
const utils = require("./utils");
const offline = require("./offline");

function config() {
    return _args;
}

function taskRootDirectory() {
    return utils.ensureDirectory(path.join(_args.taskDir, '.trescope'));
}

function taskTemporaryDirectory() {
    return utils.ensureDirectory(path.join(taskRootDirectory(), 'tmp'));
}

function getIP() {
    const result = [];
    const net = os.networkInterfaces();
    Object.keys(net).forEach(function (ifname) {
        net[ifname].forEach(function (iface) {
            if ("IPv4" !== iface.family || iface.internal !== false) return; // Skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            result.push(iface.address);
        });
    });
    return result;
}

function fetchPort(portStart, portEnd) {
    let portsToScan = [];
    for (let port = portStart; port <= portEnd; port++) portsToScan.push(port);
    return PortScanner.findAPortNotInUse(portsToScan);
}

let displaySession;

function startHttpAndWebSocketServer(port, identifier, taskDir) {
    const httpServer = network.VanillaHttpServer.create({config, taskRootDirectory, taskTemporaryDirectory});
    const displayEndpoint = new network.DisplayEndpoint(httpServer);
    displayEndpoint.on(network.Event.CONNECT, ({session, ip}) => {
        console.log(`Display with ip: ${utils.terminalColor.magenta(ip)} connected`);
        displaySession = session;
    });
    displayEndpoint.on(network.Event.DISCONNECT, ({session, ip}) => {
        displaySession = null;
        console.log(`Display with ip: ${utils.terminalColor.magenta(ip)} disconnected`);
    });

    const ips = ["127.0.0.1", ...getIP()];
    console.log(`Trescope start with 
    task identifier: ${utils.terminalColor.magenta(identifier)} , 
    task directory: ${utils.terminalColor.magenta(path.join(taskDir, '.trescope'))}`);
    console.log("Available on:");
    ips.forEach((ip) => console.log(utils.terminalColor.magenta(`    http://${ip}:${port}`)));

    displayEndpoint.listen(port);
    return {displayEndpoint, ips};
}

function startHeteroServer(port, identifier, displayEndpoint, httpServerInfo) {
    const bundle = new Map();
    const heteroLangEndpoint = new network.HeteroLanguageEndpoint(identifier);
    heteroLangEndpoint.on(network.Event.CONNECT, ({ip}) => console.log(`HeteroLanguageEndpoint with ip: ${utils.terminalColor.magenta(ip)} connected`));
    heteroLangEndpoint.on(network.Event.DISCONNECT, ({ip}) => {
        console.log(`HeteroLanguageEndpoint with ip: ${utils.terminalColor.magenta(ip)} disconnected`);
        displayEndpoint.removeListeners(network.Event.MESSAGE);

        const outputType = bundle.get("outputType");
        const directory = bundle.get("directory");
        if (outputType === "file" && directory) offline.flush(`127.0.0.1:${httpServerInfo.port}`);
    });
    heteroLangEndpoint.on(
        network.Event.MESSAGE,
        ({remoteFuncName, remoteFuncParams, token, session, ip}) => {
            const heteroSession = session;
            const reportFinishToHetero = (result) => {
                const tokenSent = token, tokenReceived = result["token"];
                if (tokenReceived !== tokenSent) throw new TrescopeException(`Token(${tokenReceived}) received doesn't match token(${tokenSent}) sent ${remoteFuncName}`);
                heteroSession.send(result);
            };
            const sendToOutputAndWaitForResult = (data) => {
                let outputType = bundle.get("outputType");
                outputType = outputType ? outputType : "display";
                if ("display" === outputType && null != displaySession) {
                    const onceListener = ({message}) => {
                        displayEndpoint.removeListener(onceListener);
                        reportFinishToHetero(message);
                    };
                    displayEndpoint.on(network.Event.MESSAGE, onceListener);
                    displaySession.send({...data, token});
                } else {
                    offline.send(data);
                    reportFinishToHetero({token, success: true});
                }
            };

            rpc.get(remoteFuncName)({
                token,
                heteroSession,
                displaySession,
                params: remoteFuncParams,
                context: {heteroIP: ip, bundle, displayEndpoint},
                sendToOutputAndWaitForResult,
            });
        }
    );
    heteroLangEndpoint.listen(port);
    return heteroLangEndpoint;
}

async function startInternal(args, portStart, portEnd) {
    const {identifier, taskDir} = args;
    const port1 = await fetchPort(portStart, portEnd);
    const {displayEndpoint, ips} = startHttpAndWebSocketServer(port1, identifier, taskDir);
    const port2 = await fetchPort(portStart, portEnd);
    startHeteroServer(port2, identifier, displayEndpoint, {ips, port: port1});
}

let _args;

function start(args, portStart = 9000, portEnd = 9050) {
    _args = args;
    startInternal(args, portStart, portEnd).catch(error => console.error('center.start.failed', error));
}

module.exports = {start};
