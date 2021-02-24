const PortScanner = require("portscanner");
const os = require("os");
const path = require('path');
const network = require("./network");
const rpc = require("./rpc");
const TrescopeException = require("./exception");
const utils = require("./utils");
const offline = require("./offline");
const {spawn, exec} = require('child_process');

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

let displaySession = null;
let heteroPid = -1;

function startHttpAndWebSocketServer(port, identifier, taskDir, cmd, when) {
    const httpServer = network.VanillaHttpServer.create({config, taskRootDirectory, taskTemporaryDirectory});
    const displayEndpoint = new network.DisplayEndpoint(httpServer);

    displayEndpoint.on(network.Event.CONNECT, ({session, ip}) => {
        console.log(`Display with ip: ${utils.terminalColor.magenta(ip)} connected`);
        displaySession = session;
        displaySession.send({function: 'notifyHeteroStatus', src: 'backend', heteroInfo: {pid: heteroPid}});

        if (!cmd) return;
        if ('displayConnected' !== when) return;
        spawn(cmd, [], {shell: true, stdio: 'inherit'});
        // processRunning = spawn(cmd, [], {shell: true, stdio: 'inherit'});
    });
    displayEndpoint.on(network.Event.DISCONNECT, ({session, ip}) => {
        if (heteroPid !== -1) exec(`kill ${heteroPid}`);
        displaySession = null;
        console.log(`Display with ip: ${utils.terminalColor.magenta(ip)} disconnected`);
    });

    const ips = ["127.0.0.1", ...getIP()];
    console.log(`Trescope(${utils.terminalColor.blue(_version)}) start with 
    task identifier: ${utils.terminalColor.magenta(identifier)} , 
    task directory: ${utils.terminalColor.magenta(path.join(taskDir, '.trescope'))}`);
    console.log("Available on:");
    ips.forEach((ip) => console.log(utils.terminalColor.magenta(`    http://${ip}:${port}`)));

    displayEndpoint.listen(port);
    return {displayEndpoint, ips};
}

function startHeteroServer(port, identifier, displayEndpoint, httpServerInfo) {
    const bundle = new Map();
    bundle.set('defaultArgs', _defaultArgs);
    bundle.set('blenderPath', _args.blenderPath);
    const heteroLangEndpoint = new network.HeteroLanguageEndpoint(identifier);
    heteroLangEndpoint.on(network.Event.CONNECT, ({ip, pid}) => {
        console.log(`HeteroLanguageClient with ip: ${utils.terminalColor.magenta(ip)} pid: ${utils.terminalColor.magenta(pid)} connected`);
        heteroPid = pid;
        if (null !== displaySession) displaySession.send({
            function: 'notifyHeteroStatus',
            src: 'backend',
            heteroInfo: {pid: heteroPid}
        });

    });
    heteroLangEndpoint.on(network.Event.DISCONNECT, ({ip, pid}) => {
        heteroPid = -1;
        if (null !== displaySession) displaySession.send({
            function: 'notifyHeteroStatus',
            src: 'backend',
            heteroInfo: {pid: heteroPid}
        });
        displayEndpoint.removeListeners(network.Event.MESSAGE);
        console.log(`HeteroLanguageClient with ip: ${utils.terminalColor.magenta(ip)} pid: ${utils.terminalColor.magenta(pid)} disconnected`);
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
                        if (message['src'] === 'backend') return;
                        displayEndpoint.removeListener(onceListener);
                        reportFinishToHetero(message);
                    };
                    displayEndpoint.on(network.Event.MESSAGE, onceListener);
                    displaySession.send({...data, token});
                } else {
                    offline.send(bundle, {...data, token}, `127.0.0.1:${httpServerInfo.port}`, reportFinishToHetero);
                }
            };

            rpc.get(remoteFuncName)({
                token, heteroSession, displaySession,
                params: remoteFuncParams,
                context: {heteroIP: ip, bundle, displayEndpoint},
                sendToOutputAndWaitForResult,
            });
        }
    );
    heteroLangEndpoint.listen(port);
    return heteroLangEndpoint;
}

async function startInternal(portStart, portEnd) {
    const {identifier, taskDir, cmd, when, mainPort} = _args;
    const port1 = mainPort ? mainPort : await fetchPort(portStart, portEnd);
    const {displayEndpoint, ips} = startHttpAndWebSocketServer(port1, identifier, taskDir, cmd, when);
    const port2 = await fetchPort(portStart, portEnd);
    startHeteroServer(port2, identifier, displayEndpoint, {ips, port: port1});
}

let _args, _version, _defaultArgs;

function start(args, defaultArgs, version, portStart, portEnd) {
    _args = args;
    _defaultArgs = defaultArgs;
    _version = version;
    startInternal(portStart, portEnd).catch(error => console.error('center.start.failed', error));
}

module.exports = {start};
