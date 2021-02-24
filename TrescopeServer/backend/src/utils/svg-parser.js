function cmdToFunc(cmd, shape) {
    switch (cmd) {
        case 'm':
        case 'M':
            return shape.moveTo.bind(shape);
        case 'l':
        case 'L':
            return shape.lineTo.bind(shape);
        default:
            return null;
    }
}

function parse(svg, reducer) {
    const shape = reducer;
    const segments = svg.replace(/[a-zA-Z]/g, (char) => `\n${char}\n`).split('\n').filter(e => e !== '');
    let currentFunc = null;
    segments.some(segment => {
        let cmd = segment.match(/[a-zA-Z]/g);
        cmd = cmd?cmd[0]:null;
        if ('z' === cmd || 'Z' === cmd) return true;
        if (cmd) currentFunc = cmdToFunc(cmd, shape);
        else currentFunc(...segment.split(' ').filter(e => e !== '').map(e => eval(e)));
        return false;
    });
    return shape;
}

module.exports = {parse};