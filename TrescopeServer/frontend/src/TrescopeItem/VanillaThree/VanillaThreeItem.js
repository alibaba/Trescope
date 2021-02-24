import React from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";

function createTextureMesh3DTrace(data) {
    const {x, y, z, u, v, nx, ny, nz, i, j, k, texture, normalColor, normalSize, pointColor, pointSize, wireframe, name} = data;
    const vertexLen = x.length, faceLen = i.length;
    const vertices = [], uvs = [], faces = [];
    for (let iii = 0; iii < vertexLen; iii++) {
        vertices.push(x[iii], y[iii], z[iii]);
        uvs.push(u[iii], v[iii]);
    }

    for (let iii = 0; iii < faceLen; iii++) faces.push(i[iii], j[iii], k[iii]);

    const geometry = new THREE.BufferGeometry();
    const vertices_ = new Float32Array(vertices);
    const uvs_ = new Float32Array(uvs);
    const faces_ = new Uint16Array(faces);
    const texture_ = new THREE.TextureLoader().load(`http://${window.location.host}/fetch?file=${texture}`);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices_, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs_, 2));

    const normals = new Float32Array(vertices);
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geometry.computeVertexNormals();

    geometry.setIndex(new THREE.BufferAttribute(faces_, 1));

    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const material = new THREE.MeshBasicMaterial({map: texture_, wireframe});
    const main = new THREE.Mesh(geometry, material);
    const result = [main];

    if (pointSize > 0) {
        const dot = new THREE.Points(geometry, new THREE.PointsMaterial({
            color: pointColor,
            size: pointSize, sizeAttenuation: false,
            map: new THREE.TextureLoader().load('point.png'), alphaTest: 0.5, transparent: true
        }));
        result.push(dot);
    }

    if (nx && ny && nz && normalSize > 0) {
        const normalHelper = new VertexNormalsHelper(main, normalSize, normalColor);
        result.push(normalHelper);
    }

    return result;
}

class VanillaThreeItem extends React.Component {
    renderer;
    camera;
    version;
    size;
    scene;

    constructor(props) {
        super(props);
        const {size} = props;
        this.size = size;
        this.canvas = React.createRef();
    }

    shouldComponentUpdate(nextProps) {
        const {version} = nextProps.itemRenderer;
        const {size} = nextProps;

        const sameVersion = this.version === version;
        const sameSize = this.size.width === size.width && this.size.height === size.height;

        this.size = size;
        this.version = version;
        if (!sameVersion) return true;
        if (!sameSize) {
            this.renderer.setSize(size.width, size.height);
            if (this.camera) this.camera.aspect = this.aspect();
            this.camera.updateProjectionMatrix();
            return false;
        }
        return false;
    }

    componentDidUpdate(props) {
        this.update()
    }

    update() {
        const {scene: {camera}} = this.props.itemRenderer.layout;
        const {size, itemRenderer: {data}} = this.props;
        this.renderer.setSize(size.width, size.height);
        if (this.camera) this.camera.aspect = this.aspect();

        const trace = data[data.length - 1];
        const obj3ds = {'model3d': createTextureMesh3DTrace}[trace.type](trace);
        this.scene.add(...obj3ds);
        const bbox = new THREE.Box3().setFromObject(this.scene);
        const center = bbox.getCenter(new THREE.Vector3());
        this.controls.target.copy(center);
        const extension = bbox.getSize(new THREE.Vector3());
        const dist = Math.max(extension.x, extension.y, extension.z) / 2 / Math.tan(Math.PI * camera.fovy / 360);
        this.camera.position.set(dist / 1.7 + center.x, dist / 1.7 + center.y, dist / 1.7 + center.z);

        const bbox_min_to_camera = bbox.min.distanceTo(this.camera.position);
        const bbox_max_to_camera = bbox.max.distanceTo(this.camera.position);
        this.camera.far = Math.max(bbox_min_to_camera, bbox_max_to_camera) * 5;
        this.camera.near = Math.min(bbox_min_to_camera, bbox_max_to_camera) * .05;
        this.camera.updateProjectionMatrix();
    }

    componentDidMount() {
        const canvasRef = this.canvas.current;
        this.renderer = new THREE.WebGLRenderer({canvas: canvasRef, antialias: true, alpha: true});
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.setSize(this.size.width, this.size.height);
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(new THREE.Color(0xffffff), .8));

        const {scene: {camera}} = this.props.itemRenderer.layout;
        this.camera = new THREE.PerspectiveCamera(camera.fovy, this.aspect(), camera.near, camera.far);
        this.camera.up.set(camera.up.x, camera.up.y, camera.up.z);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.update();

        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    aspect() {
        const {size} = this.props;
        return size.height === 0 || size.width === 0 ? 1 : size.width / size.height;
    }

    render() {
        const {width, height} = this.props.size;
        return <canvas ref={this.canvas} style={{width, height, backgroundColor: 'white'}}/>;
    }
}

export default VanillaThreeItem;
