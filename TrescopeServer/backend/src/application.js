const version = require("./version");
const process = require('process');

const argv = require('yargs')
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
    .option('mainPort', {
        describe: 'Http service port',
        type: 'int',
    })
    .option('blenderPath', {
        describe: 'Blender path',
        type: 'string',
        default: 'blender'
    })
    .version(version.version)

    .command('autoRun [cmd] [when]', 'Specify command to run when event ( such as displayConnected etc.) triggered ', (yargs) => {
        yargs.positional('cmd', {
            type: 'string',
            describe: 'The command to run'
        });
        yargs.positional('when', {
            type: 'string',
            describe: 'The chance to trigger cmd. Enumerations of [ displayConnected ]',
            default: 'displayConnected'
        });
    })
    .argv;

const defaultArgs = process.argv[process.argv.length - 1].split(';').map(e => e.split('=')).reduce((sum, [k, v]) => {
    sum[k] = v;
    return sum
}, {});

const portStart = 9000, portEnd = 9100;
const center = require("./center");

center.start(argv, defaultArgs, version.version, portStart, portEnd);
