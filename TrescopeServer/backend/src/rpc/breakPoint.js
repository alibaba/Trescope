function breakPoint({params: {identifier}, sendToOutputAndWaitForResult}) {
    sendToOutputAndWaitForResult({function: 'breakPoint', identifier});
}

module.exports = breakPoint;

