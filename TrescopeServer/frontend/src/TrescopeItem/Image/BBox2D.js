import React from 'react';
import {uuid} from '../../Utils/Utils'

const initMouse = {
    width: 0, height: 0,
    offsetX: 0, offsetY: 0,
    startX: 0, startY: 0,
    isDrawing: false
};
const getElementOffset = element => {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
    };
};

const getCoords = event => {
    if (event.pageX || event.pageY) return {x: event.pageX, y: event.pageY};
    return {x: event.clientX, y: event.clientY};
};

export default class BBox2D extends React.Component {
    down = event => {
        if ('g' === event.target.parentNode.tagName) return;

        const mouseCoords = getCoords(event);
        const offset = getElementOffset(event.target.parentNode);
        const startX = mouseCoords.x - offset.left;
        const startY = mouseCoords.y - offset.top;

        this.setState(state => {
            state.mouse.isDrawing = true;
            state.mouse.startX = startX;
            state.mouse.startY = startY;
            state.mouse.width = 5;
            state.mouse.height = 5;
            state.mouse.offsetX = offset.left;
            state.mouse.offsetY = offset.top;
            return state;
        });
    };
    up = event => {
        if (!this.state.mouse.isDrawing) return;

        const width = this.state.mouse.width;
        const height = this.state.mouse.height;

        if (width < 5 || height < 5) {
            this.setState(state => {
                state.mouse = {...initMouse};
                return state;
            });
        } else {
            this.setState(state => {
                const id = uuid();
                state.boundingBoxes[id] = this.realBoxInfo(state.mouse);
                this.tryToSendPickedData(id, state.boundingBoxes[id],
                    () => this.setState(state => {
                        delete state.boundingBoxes[id];
                        return state;
                    }));
                state.mouse = {...initMouse};
                return state;
            });
        }
    };
    move = event => {
        if (!this.state.mouse.isDrawing) return;

        let currentX = event.pageX - this.state.mouse.offsetX;
        let currentY = event.pageY - this.state.mouse.offsetY;

        let width = currentX - this.state.mouse.startX;
        let height = currentY - this.state.mouse.startY;
        if (width <= 0) width = Math.abs(width);
        else currentX = this.state.mouse.startX;
        if (height <= 0) height = Math.abs(height);
        else currentY = this.state.mouse.startY;

        this.setState(state => {
            state.mouse.startX = currentX;
            state.mouse.startY = currentY;
            state.mouse.width = width;
            state.mouse.height = height;
            return state;
        });
    };
    leave = event => {
        if (!this.state.mouse.isDrawing) return;
        this.setState(state => {
            state.mouse = {...initMouse};
            return state;
        });
    };

    tryToSendPickedData = (id, boundingBox, unpickNotify) => {
        try {
            window.dispatchEvent(new CustomEvent('trescope-visual-data-picked', {
                detail: {
                    uid: id,
                    value: {
                        name: `x:${boundingBox.startX},y:${boundingBox.startY},width:${boundingBox.width},height:${boundingBox.height}`,
                        data: {
                            x: boundingBox.startX, y: boundingBox.startY,
                            width: boundingBox.width, height: boundingBox.height
                        },
                    },
                    unpickNotify,
                    outputId: this.props.outputId,
                    controlId: this.props.controlAttached
                }
            }));
        } catch (e) {
            console.error('tryToSendPickedData.error', e);
        } finally {
            this.pickedData = null;
        }
    };

    realBoxInfo(boundingBox) {
        const {width, height} = this.props.size;
        const realX = Math.round(boundingBox.startX / width * this.props.imageNaturalSize.width),
            realY = Math.round(boundingBox.startY / height * this.props.imageNaturalSize.height);
        const realWidth = Math.round(boundingBox.width / width * this.props.imageNaturalSize.width),
            realHeight = Math.round(boundingBox.height / height * this.props.imageNaturalSize.height);
        return {startX: realX, startY: realY, width: realWidth, height: realHeight};
    }

    renderBoxInfo(boundingBox) {
        const {width, height} = this.props.size;
        const renderX = Math.round(boundingBox.startX / this.props.imageNaturalSize.width * width),
            renderY = Math.round(boundingBox.startY / this.props.imageNaturalSize.height * height);
        const renderWidth = Math.round(boundingBox.width / this.props.imageNaturalSize.width * width),
            renderHeight = Math.round(boundingBox.height / this.props.imageNaturalSize.height * height);
        return {startX: renderX, startY: renderY, width: renderWidth, height: renderHeight};
    }

    constructor(props) {
        super(props);

        const boundingBoxes = this.props.value.reduce((obj, boundingBoxMaybe) => {
            boundingBoxMaybe = /\(([^)]+)\)/.exec(boundingBoxMaybe)[1].split(',');
            if ('bbox2d' !== boundingBoxMaybe[0]) return obj;
            const [x, y, w, h] = boundingBoxMaybe.slice(1).map(Number);
            const id = uuid();
            obj[id] = {startX: x, startY: y, width: w, height: h};

            this.tryToSendPickedData(id, obj[id],
                () => this.setState(state => {
                    delete state.boundingBoxes[id];
                    return state;
                }));

            return obj;
        }, {});
        this.state = {
            boundingBoxes,
            mouse: {...initMouse}
        }
    }


    renderManual = () => {
        const strokeWidth = 2;
        const boundingBoxes = Object.entries(this.state.boundingBoxes);
        return boundingBoxes.length > 0 ? (
            <>
                {this.state.mouse.isDrawing ? (
                    <rect
                        x={this.state.mouse.startX}
                        y={this.state.mouse.startY}
                        width={this.state.mouse.width}
                        height={this.state.mouse.height}
                        fill='none'
                        style={{strokeWidth, stroke: 'black'}}
                    />
                ) : null}
                {boundingBoxes.map(([id, box], index) => {
                    box = this.renderBoxInfo(box);
                    return (<g key={index} style={{cursor: 'pointer'}}>
                        <rect
                            x={box.startX}
                            y={box.startY}
                            width={box.width}
                            height={box.height}
                            fill='none'
                            style={{strokeWidth, stroke: 'black'}}
                        />
                    </g>);
                })}
            </>
        ) : (
            <>
                {this.state.mouse.isDrawing ? (
                    <rect
                        x={this.state.mouse.startX}
                        y={this.state.mouse.startY}
                        width={this.state.mouse.width}
                        height={this.state.mouse.height}
                        fill='none'
                        style={{strokeWidth, stroke: 'black'}}
                    />
                ) : null}
            </>
        );
    };


    render() {
        const {width, height} = this.props.size;
        return (
            <div style={{position: 'relative', width, height}}>
                <div
                    style={{position: 'absolute', left: 0, top: 0}}
                    onMouseLeave={this.leave}
                    onMouseUp={this.up}
                    onMouseMove={this.move}
                    onMouseDown={this.down}
                >
                    <svg width={width} height={height} style={{border: '2px dashed black'}}> {this.renderManual()}</svg>
                </div>
            </div>
        );
    }
}
