const terminalColor = require('./terminal-color');
const miscs = require('./miscs');
const svgParser = require('./svg-parser');
const fs = require("fs");
const path = require("path");

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function intColorToRGBA(color) {
    color >>>= 0;
    const b = color & 0xff;
    const g = (color & 0xff00) >>> 8;
    const r = (color & 0xff0000) >>> 16;
    const a = ((color & 0xff000000) >>> 24) / 255;
    return {r, g, b, a};
}

function getFiles(filePath, extname) {
    let resultFiles = [];
    const files = fs.readdirSync(filePath);

    for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        const fileDir = path.join(filePath, filename);
        const stats = fs.statSync(fileDir);
        if (stats.isFile()) {
            if (extname === undefined) {
                resultFiles.push(fileDir);
            } else if (path.extname(filename) === extname) {
                resultFiles.push(fileDir);
            }
        } else if (stats.isDirectory()) {
            resultFiles.concat(getFiles(fileDir, extname));
        }
    }

    return resultFiles;
}

function ensureDirectory(directory) {
    directory = path.resolve(directory);
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);
    return directory;
}

module.exports = {
    svgParser,
    terminalColor, miscs,
    getFiles, ensureDirectory,
    intToRGBA: (colorOrColorArray) => {
        if (!Array.isArray(colorOrColorArray)) {
            const {r, g, b, a} = intColorToRGBA(colorOrColorArray);
            return `rgba(${r},${g},${b},${a})`;
        }
        return colorOrColorArray.map(intColorToRGBA).map(({r, g, b}) => `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`);
    },
    makeRandomString: (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    },

};