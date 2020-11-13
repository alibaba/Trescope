const utils = require("../utils");

function updateLayout({
                          params: {
                              outputId,
                              title, showLegend, axisUniformScale,
                              eye, center, up, fovy, aspect, near, far, projectionType
                          },
                          context: {bundle},
                          sendToOutputAndWaitForResult,
                      }) {
    const layout = {};
    let camera = {};
    if (eye) camera['eye'] = {x: eye[0], y: eye[1], z: eye[2]};
    if (up) camera['up'] = {x: up[0], y: up[1], z: up[2]};
    if (center) camera['center'] = {x: center[0], y: center[1], z: center[2]};
    if (projectionType) camera['projection'] = {type: projectionType};

    if (fovy !== null) camera['fovy'] = fovy;
    if (aspect !== null) camera['aspect'] = aspect;
    if (near !== null) camera['near'] = near;
    if (far !== null) camera['far'] = far;

    if (Object.keys(camera).length > 0) {
        layout['scene'] = {
            camera,
            aspectmode: "data",
            ...utils.miscs.TemplateSceneXYZAxis
        }
    }

    if (title) layout['title'] = title;
    //null,false,true
    if (true === axisUniformScale) layout['yaxis'] = {scaleanchor: 'x', scaleratio: 1};//keep x , y equal ratio when 2d
    if (false === axisUniformScale) layout['yaxis'] = {};
    if (true === showLegend) layout['showlegend'] = true;
    if (false === showLegend) layout['showlegend'] = false;


    sendToOutputAndWaitForResult({
        function: "updateLayout",
        layout, outputId
    });
}

module.exports = updateLayout;
