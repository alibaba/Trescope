import React from "react";
import BBox2D from "./BBox2D";
import ReactResizeDetector from 'react-resize-detector';

function getImageRenderInfo(contains, cWidth, cHeight, width, height, positionX, positionY) {
    const oRatio = width / height, cRatio = cWidth / cHeight;
    const result = {};
    if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
        result.width = cWidth;
        result.height = cWidth / oRatio;
    } else {
        result.width = cHeight * oRatio;
        result.height = cHeight;
    }
    result.x = (cWidth - result.width) * (positionX / 100);
    // result.right = result.width + result.left;
    result.y = (cHeight - result.height) * (positionY / 100);
    // result.bottom = result.height + result.top;
    return result;
}

class ImageItem extends React.Component {
    controlAttach = (event) => {
        const {controlId, outputId, colorWhenPicked, value} = event.detail;
        if (this.props.itemRenderer.outputId !== outputId) return;

        this.controlAttached = controlId;
        this.colorWhenPicked = colorWhenPicked;
        this.defaultValue = value;
    };

    constructor(props) {
        super(props);
        this.image = React.createRef();
        this.controlAttached = null;
        this.colorWhenPicked = null;
        this.defaultValue = null;
        this.state = {imageRenderInfo: {x: 0, y: 0, width: 0, height: 0}, imageNaturalSize: {width: 0, height: 0}};
    }


    render() {
        const {itemRenderer: {data}, size: {width, height}} = this.props;
        const {remoteOrLocalPath} = data[0];
        const src = `http://${window.location.host}/fetch?file=${remoteOrLocalPath}`;
        return <div style={{position: 'relative', width, height}}>
            <div style={{
                position: 'absolute', left: 0, top: 0,
                width, height, overflow: 'hidden', resize: 'both'
            }}>
                <img ref={this.image} src={src} style={{height: '100%', width: '100%', objectFit: 'contain'}} alt=''
                     onLoad={(event) => {
                         const element = event.target;
                         const objectPosition = window.getComputedStyle(element).getPropertyValue('object-position').split(' ');
                         const imageRenderInfo = getImageRenderInfo(true,
                             element.width, element.height,
                             element.naturalWidth, element.naturalHeight,
                             parseInt(objectPosition[0]), parseInt(objectPosition[1]),
                         );
                         this.setState({
                             imageRenderInfo,
                             imageNaturalSize: {width: element.naturalWidth, height: element.naturalHeight}
                         });
                     }}/>
                <ReactResizeDetector
                    handleWidth handleHeight
                    onResize={(width, height) => {
                        const element = this.image.current;
                        const objectPosition = window.getComputedStyle(element).getPropertyValue('object-position').split(' ');
                        const imageRenderInfo = getImageRenderInfo(true,
                            element.width, element.height,
                            element.naturalWidth, element.naturalHeight,
                            parseInt(objectPosition[0]), parseInt(objectPosition[1]),
                        );
                        this.setState({
                            imageRenderInfo,
                            imageNaturalSize: {width: element.naturalWidth, height: element.naturalHeight}
                        });
                    }}/>
            </div>
            {
                null !== this.controlAttached && this.state.imageRenderInfo.width !== 0 && this.state.imageRenderInfo.height !== 0 ?
                    <div style={{
                        position: 'absolute',
                        left: this.state.imageRenderInfo.x,
                        top: this.state.imageRenderInfo.y,
                        cursor: 'crosshair',
                    }}>
                        <BBox2D
                            size={{width: this.state.imageRenderInfo.width, height: this.state.imageRenderInfo.height}}
                            imageNaturalSize={{
                                width: this.state.imageNaturalSize.width,
                                height: this.state.imageNaturalSize.height
                            }}
                            value={this.defaultValue}
                            outputId={this.props.itemRenderer.outputId}
                            controlAttached={this.controlAttached}/>
                    </div> : null
            }
        </div>
    }

    componentWillMount() {
        window.addEventListener("trescope-control-attach", this.controlAttach);
    }

    componentWillUnmount() {
        window.removeEventListener("trescope-control-attach", this.controlAttach);
    }
}

export default ImageItem;
