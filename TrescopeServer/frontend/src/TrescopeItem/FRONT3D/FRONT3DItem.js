import React from 'react';
import {createScene} from 'scene-json-renderer';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

class FRONT3DItem extends React.Component {
    renderer;
    camera;
    version;
    size;

    constructor(props) {
        super(props);
        const {version} = props.itemRenderer;
        const {size} = props;
        this.version = version;
        this.size = size;
        this.canvas = React.createRef();
    }

    shouldComponentUpdate(nextProps, nextState, snap) {
        const {version} = nextProps.itemRenderer;
        const {size} = nextProps;

        const sameVersion = (this.version === version);
        if (!sameVersion) {
            this.size = size;
            this.version = version;
            return true;
        }


        const sameSize = (this.size.width === size.width && this.size.height === size.height);
        if (!sameSize) {
            this.size = size;
            this.version = version;
            this.renderer.setSize(size.width, size.height);
            if (this.camera) this.camera.aspect = this.aspect();
            this.canvas.current.width = size.width;
            this.canvas.current.height = size.height;
            this.canvas.current.style.width = size.width;
            this.canvas.current.style.height = size.height;
            return false;
        }

        this.size = size;
        this.version = version;
        return false;
    }

    componentDidUpdate(preProps, preState, snap) {
        const {size} = this.props;
        this.renderer.setSize(size.width, size.height);
        if (this.camera) this.camera.aspect = this.aspect();
    }

    componentDidMount() {
        const canvasRef = this.canvas.current;
        this.renderer = new THREE.WebGLRenderer({canvas: canvasRef, antialias: true});
        this.renderer.setSize(this.size.width, this.size.height);
        const {houseLayoutFile, shapeLocalSource, shapeRemoteSource, view, unit, hiddenMeshes, renderType} = this.props.itemRenderer.data;
        const {scene: {camera}} = this.props.itemRenderer.layout;
        createScene(houseLayoutFile,
            shapeLocalSource, shapeRemoteSource,
            view, camera, this.aspect(),
            unit, hiddenMeshes, renderType,
            window.location.host)
            .then(({scene, camera, cameraTarget}) => {
                this.camera = camera;
                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.controls.target = cameraTarget;

                const animate = () => {
                    requestAnimationFrame(animate);
                    this.controls.update();
                    this.renderer.render(scene, this.camera);
                };
                animate();
            });
    }

    aspect() {
        const {size} = this.props;
        return size.height === 0 || size.width === 0 ? 1 : size.width / size.height;
    }

    render() {
        const {width, height} = this.props.size;
        return <canvas ref={this.canvas} width={width} height={height} style={{width, height}}/>;
    }
}

export default FRONT3DItem;
