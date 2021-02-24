const utils = require('../../utils');
const THREE = require('three');

class YX2XYShape extends THREE.Shape {
    constructor(anchor) {
        super();
        this.anchor = new THREE.Vector2(anchor.x, anchor.y);
    }

    getPoint(t) {
        const v = super.getPoint(t);
        return new THREE.Vector2(-v.y, v.x);
    }

    getPointAt(u, optionalTarget) {
        const v = super.getPointAt(u);
        return new THREE.Vector2(-v.y, v.x);
    }

    getPoints(divisions) {
        return super.getPoints(divisions).map(v => new THREE.Vector2(-v.y, v.x));
    }

    getSpacedPoints(divisions) {
        return super.getSpacedPoints(divisions).map(v => new THREE.Vector2(-v.y, v.x));
    }
}

class XZPathCurve extends THREE.Curve {
    constructor(y = 0) {
        super();
        this.y = 0;//TODO
        this.core = new THREE.Path();
    }

    fromPoints(vectors) {
        this.core.fromPoints(vectors);
        return this;
    }

    setFromPoints(vectors) {
        this.core.setFromPoints(vectors);
        return this;
    }

    moveTo(x, y) {
        this.core.moveTo(x, y);
        return this;
    }

    lineTo(x, y) {
        this.core.lineTo(x, y);
        return this;
    }

    quadraticCurveTo(aCPx, aCPy, aX, aY) {
        this.core.quadraticCurveTo(aCPx, aCPy, aX, aY);
        return this;
    }

    bezierCurveTo(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
        this.core.bezierCurveTo(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY);
        return this;
    }

    splineThru(pts) {
        this.core.splineThru(pts);
        return this;
    }

    arc(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
        this.core.arc(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise);
        return this;
    }

    absarc(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
        this.core.absarc(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise);
        return this;
    }

    ellipse(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
        this.core.ellipse(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);
        return this;
    }

    absellipse(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
        this.core.absellipse(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);
        return this;
    }

    getPoint(t, optionalTarget) {
        const v = this.core.getPoint(t);
        return new THREE.Vector3(v.x, this.y, v.y);
    }

    getPointAt(u, optionalTarget) {
        const v = this.core.getPointAt(u, optionalTarget);
        return new THREE.Vector3(v.x, this.y, v.y);
    }

    getPoints(divisions) {
        return this.core.getPoints(divisions).map(v => new THREE.Vector3(v.x, this.y, v.y));
    }

    getSpacedPoints(divisions) {
        return this.core.getSpacedPoints(divisions).map(v => new THREE.Vector3(v.x, this.y, v.y));
    }

    getLength() {
        return this.core.getLength();
    }

    getLengths(divisions) {
        return this.core.getLengths(divisions);
    }

    updateArcLengths() {
        this.core.updateArcLengths();
    }

    getUtoTmapping(u, distance) {
        return this.core.getUtoTmapping(u, distance);
    }

    getTangent(t, optionalTarget) {
        const v = this.core.getTangent(t, optionalTarget);
        return new THREE.Vector3(v.x, this.y, v.y);
    }

    getTangentAt(u, optionalTarget) {
        const v = this.core.getTangentAt(u, optionalTarget);
        return new THREE.Vector3(v.x, this.y, v.y);
    }

    // clone(): Curve<T>;
    // copy( source: Curve<T> );
    // toJSON(): object;
    // fromJSON( json: object );
}

function extrudeSVG({
                        params: {param},
                        token,
                        heteroSession,
                    }) {
    const {shape, path, steps} = JSON.parse(param);
    const shapeSVG = shape.svg, shapeAnchor = shape.anchor;
    const shapeThree = utils.svgParser.parse(shapeSVG, new YX2XYShape(shapeAnchor));
    const pathSVG = path.svg, pathHeight = path.height;
    const pathThree = utils.svgParser.parse(pathSVG, new XZPathCurve(pathHeight));

    const extrudeSettings = {
        extrudePath: pathThree,
        bevelEnabled: false,
        steps,
    };

    const geometry = new THREE.ExtrudeGeometry(shapeThree, extrudeSettings);
    const xyz = [], uv = [], normal = [], faces = [];
    const faceVertexUv = geometry.faceVertexUvs[0];
    geometry.faces.forEach((f, index) => {
        // xyz.push(
        //     geometry.vertices[f.a].x, geometry.vertices[f.a].y, geometry.vertices[f.a].z,
        //     geometry.vertices[f.b].x, geometry.vertices[f.b].y, geometry.vertices[f.b].z,
        //     geometry.vertices[f.c].x, geometry.vertices[f.c].y, geometry.vertices[f.c].z);
        xyz.push(
            geometry.vertices[f.a].x, geometry.vertices[f.a].y + pathHeight, geometry.vertices[f.a].z,
            geometry.vertices[f.b].x, geometry.vertices[f.b].y + pathHeight, geometry.vertices[f.b].z,
            geometry.vertices[f.c].x, geometry.vertices[f.c].y + pathHeight, geometry.vertices[f.c].z);
        uv.push(
            faceVertexUv[index][0].x, faceVertexUv[index][0].y,
            faceVertexUv[index][1].x, faceVertexUv[index][1].y,
            faceVertexUv[index][2].x, faceVertexUv[index][2].y,
        );
        normal.push(
            f.vertexNormals[0].x, f.vertexNormals[0].y, f.vertexNormals[0].z,
            f.vertexNormals[1].x, f.vertexNormals[1].y, f.vertexNormals[1].z,
            f.vertexNormals[2].x, f.vertexNormals[2].y, f.vertexNormals[2].z,);
        faces.push(index * 3, index * 3 + 1, index * 3 + 2);
    });

    const result = {
        extrudeAxis: pathThree.getPoints(1).map(v => ({x: v.x, y: v.y, z: v.z})),
        mesh: {xyz, uv, normal, faces}
    };

    heteroSession.send({success: true, token, result});
}

module.exports = extrudeSVG;
