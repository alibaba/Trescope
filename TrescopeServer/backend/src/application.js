const version = require("./version");
const process = require('process');

const args = require('yargs')
    .option('identifier', {
        describe: 'Task identifier, any meaningful string specified in your python code where Trescope().initialize',
        alias: 'id',
        type: 'string',
        default: 'main'
    })
    .option('taskDir', {
        describe: 'Task temporary directory for cache and config',
        type: 'string',
        default: process.cwd()
    })
    .version(version.version)
    .argv;

const center = require("./center");

center.start(args);