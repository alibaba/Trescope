const _reset = '\x1b[0m';

const _black = '\x1b[30m';
const _red = '\x1b[31m';
const _green = '\x1b[32m';
const _yellow = '\x1b[33m';
const _blue = '\x1b[34m';
const _magenta = '\x1b[35m';
const _cyan = '\x1b[36m';
const _white = '\x1b[37m';

function magenta(text) {
    return `${_magenta}${text}${_reset}`
}

function blue(text) {
    return `${_blue}${text}${_reset}`
}

function red(text) {
    return `${_red}${text}${_reset}`
}

module.exports = {magenta, red, blue};

