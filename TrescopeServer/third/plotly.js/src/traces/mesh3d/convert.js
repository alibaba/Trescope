/**
* Copyright 2012-2021, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

'use strict';

var createMesh = require('gl-mesh3d');
var triangulate = require('delaunay-triangulate');
var alphaShape = require('alpha-shape');
var convexHull = require('convex-hull');

var parseColorScale = require('../../lib/gl_format_color').parseColorScale;
var str2RgbaArray = require('../../lib/str2rgbarray');
var extractOpts = require('../../components/colorscale').extractOpts;
var zip3 = require('../../plots/gl3d/zip3');

function Mesh3DTrace(scene, mesh, uid) {
    this.scene = scene;
    this.uid = uid;
    this.mesh = mesh;
    this.name = '';
    this.color = '#fff';
    this.data = null;
    this.showContour = false;
}

var proto = Mesh3DTrace.prototype;

proto.handlePick = function(selection) {
    if(selection.object === this.mesh) {
        var selectIndex = selection.index = selection.data.index;

        if(selection.data._cellCenter) {
            selection.traceCoordinate = selection.data.dataCoordinate;
        } else {
            selection.traceCoordinate = [
                this.data.x[selectIndex],
                this.data.y[selectIndex],
                this.data.z[selectIndex]
            ];
        }

        var text = this.data.hovertext || this.data.text;
        if(Array.isArray(text) && text[selectIndex] !== undefined) {
            selection.textLabel = text[selectIndex];
        } else if(text) {
            selection.textLabel = text;
        }

        return true;
    }
};

function parseColorArray(colors) {
    var b = [];
    var len = colors.length;
    for(var i = 0; i < len; i++) {
        b[i] = str2RgbaArray(colors[i]);
    }
    return b;
}

// Unpack position data
function toDataCoords(axis, coord, scale, calendar) {
    var b = [];
    var len = coord.length;
    for(var i = 0; i < len; i++) {
        b[i] = axis.d2l(coord[i], 0, calendar) * scale;
    }
    return b;
}

// Round indices if passed as floats
function toRoundIndex(a) {
    var b = [];
    var len = a.length;
    for(var i = 0; i < len; i++) {
        b[i] = Math.round(a[i]);
    }
    return b;
}

function delaunayCells(delaunayaxis, positions) {
    var d = ['x', 'y', 'z'].indexOf(delaunayaxis);
    var b = [];
    var len = positions.length;
    for(var i = 0; i < len; i++) {
        b[i] = [positions[i][(d + 1) % 3], positions[i][(d + 2) % 3]];
    }
    return triangulate(b);
}

// Validate indices
function hasValidIndices(list, numVertices) {
    var len = list.length;
    for(var i = 0; i < len; i++) {
        if(list[i] <= -0.5 || list[i] >= numVertices - 0.5) { // Note: the indices would be rounded -0.49 is valid.
            return false;
        }
    }
    return true;
}

proto.update = function(data) {
    var scene = this.scene;
    var layout = scene.fullSceneLayout;

    this.data = data;

    var numVertices = data.x.length;

    var positions = zip3(
        toDataCoords(layout.xaxis, data.x, scene.dataScale[0], data.xcalendar),
        toDataCoords(layout.yaxis, data.y, scene.dataScale[1], data.ycalendar),
        toDataCoords(layout.zaxis, data.z, scene.dataScale[2], data.zcalendar)
    );

    var cells;
    if(data.i && data.j && data.k) {
        if(
            data.i.length !== data.j.length ||
            data.j.length !== data.k.length ||
            !hasValidIndices(data.i, numVertices) ||
            !hasValidIndices(data.j, numVertices) ||
            !hasValidIndices(data.k, numVertices)
        ) {
            return;
        }
        cells = zip3(
            toRoundIndex(data.i),
            toRoundIndex(data.j),
            toRoundIndex(data.k)
        );
    } else if(data.alphahull === 0) {
        cells = convexHull(positions);
    } else if(data.alphahull > 0) {
        cells = alphaShape(data.alphahull, positions);
    } else {
        cells = delaunayCells(data.delaunayaxis, positions);
    }

    var config = {
        positions: positions,
        cells: cells,
        lightPosition: [data.lightposition.x, data.lightposition.y, data.lightposition.z],
        ambient: data.lighting.ambient,
        diffuse: data.lighting.diffuse,
        specular: data.lighting.specular,
        roughness: data.lighting.roughness,
        fresnel: data.lighting.fresnel,
        vertexNormalsEpsilon: data.lighting.vertexnormalsepsilon,
        faceNormalsEpsilon: data.lighting.facenormalsepsilon,
        opacity: data.opacity,
        contourEnable: data.contour.show,
        contourColor: str2RgbaArray(data.contour.color).slice(0, 3),
        contourWidth: data.contour.width,
        useFacetNormals: data.flatshading
    };

    if('undefined' !== typeof Image && data.texture && data.u && data.v) {
        const zip2 = (x, y, len) => {
            len = len || x.length;
            const result = new Array(len);
            for(let i = 0; i < len; i++) result[i] = [x[i], y[i]];
            return result;
        };

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const drawScaleImage = (width, height, flip) => {
                canvas.width = width;
                canvas.height = height;
                const hRatio = canvas.width / image.width;
                const vRatio = canvas.height / image.height;
                const ratio = Math.min(hRatio, vRatio);
                const centerShift_x = (canvas.width - image.width * ratio) / 2;
                const centerShift_y = (canvas.height - image.height * ratio) / 2;
                if(flip) {
                    context.translate(0, canvas.height);
                    context.scale(1, -1);
                }
                context.drawImage(image, 0, 0, image.width, image.height, centerShift_x, centerShift_y, image.width * ratio, image.height * ratio);
            };
            data.textureWrap = data.textureWrap ? data.textureWrap : 'CLAMP_TO_EDGE';
            let wrap = 'string' === typeof data.textureWrap ? [data.textureWrap, data.textureWrap] : data.textureWrap;

            if(wrap.includes('REPEAT') && (Math.log2(image.width) % 1 !== 0 || Math.log2(image.height) % 1 !== 0)) {
                drawScaleImage(512, 512, data.textureFlip);
            } else {
                drawScaleImage(image.width, image.height, data.textureFlip);
            }

            const gl = scene.glplot.gl;
            wrap = wrap.map(e => ({
                CLAMP_TO_EDGE: gl.CLAMP_TO_EDGE,
                MIRRORED_REPEAT: gl.MIRRORED_REPEAT,
                REPEAT: gl.REPEAT
            }[e]));
            config.texture = {content: canvas, wrap};
            config.vertexUVs = zip2(data.u, data.v);
            this.mesh.update(config);
        };
        image.src = data.texture;
    } else if(data.intensity) {
        var cOpts = extractOpts(data);
        this.color = '#fff';
        var mode = data.intensitymode;
        config[mode + 'Intensity'] = data.intensity;
        config[mode + 'IntensityBounds'] = [cOpts.min, cOpts.max];
        config.colormap = parseColorScale(data);
    } else if(data.vertexcolor) {
        this.color = data.vertexcolor[0];
        config.vertexColors = parseColorArray(data.vertexcolor);
    } else if(data.facecolor) {
        this.color = data.facecolor[0];
        config.cellColors = parseColorArray(data.facecolor);
    } else {
        this.color = data.color;
        config.meshColor = str2RgbaArray(data.color);
    }

    // Update mesh
    this.mesh.update(config);
};

proto.dispose = function() {
    this.scene.glplot.remove(this.mesh);
    this.mesh.dispose();
};

function createMesh3DTrace(scene, data) {
    var gl = scene.glplot.gl;
    var mesh = createMesh({gl: gl});
    var result = new Mesh3DTrace(scene, mesh, data.uid);
    mesh._trace = result;
    result.update(data);
    scene.glplot.add(mesh);
    return result;
}

module.exports = createMesh3DTrace;
