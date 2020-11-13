const fs = require('fs');
const path = require('path');
const utils = require('../utils');
const mkdirp = require('mkdirp');
const moment = require('moment');
const orca = require('orca/src');

function run(rawDataDir, targetDir, width, height, callback = utils.miscs.noop) {
    if (!fs.existsSync(rawDataDir)) return;
    if (!fs.existsSync(targetDir)) mkdirp.sync(targetDir);

    const jsonFiles = utils.getFiles(rawDataDir, '.json');
    if (jsonFiles.length <= 0) return;


    const app = orca.run({
        input: jsonFiles,
        component: {
            name: 'plotly-graph',
            options: {width, height},
        },
    });

    app.on('after-export', (info) => {
        if (info) {
            const fileNameWithExt = path.basename(jsonFiles[info.itemIndex]);
            const jsonName = `${ path.basename(fileNameWithExt, path.extname(fileNameWithExt))}.png`;
            fs.writeFile(path.join(targetDir, jsonName), info.body, utils.miscs.noop);
        }
    });

    app.on('export-error', () => console.log('orca-renderer export error'));
    app.on('after-export-all', callback);
    app.on('renderer-error', () => console.log('orca-renderer render error'));
}

module.exports = {run};