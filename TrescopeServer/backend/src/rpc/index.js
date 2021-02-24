const glob = require("glob");
const path = require("path");

const functionTable = new Map();
glob.sync(path.resolve(__dirname, "*.js")).forEach(function (file) {
    if ("index.js" === path.basename(file)) return;
    const func = require(path.resolve(file));
    if (!(func instanceof Function)) throw new Error(`RPC ${path.basename(file)} is not a function`);
    if (functionTable.get(func.name)) throw new Error(`RPC ${path.basename(file)} has a same name function`);
    functionTable.set(func.name, func);
});

glob.sync(path.resolve(__dirname, 'alg-api', "*.js")).forEach(function (file) {
    if ("index.js" === path.basename(file)) return;
    const func = require(path.resolve(file));
    if (!(func instanceof Function)) throw new Error(`RPC ${path.basename(file)} is not a function`);
    if (functionTable.get(func.name)) throw new Error(`RPC ${path.basename(file)} has a same name function`);
    functionTable.set(func.name, func);
});

function get(functionName) {
    const func = functionTable.get(functionName);
    return null != func
        ? func
        : () => console.error(`Trescope.rpc.noSuchMethod: ${functionName}`);
}

module.exports = {get};
