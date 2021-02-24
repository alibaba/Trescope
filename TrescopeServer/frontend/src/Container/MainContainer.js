import React from 'react';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import ReactResizeDetector from 'react-resize-detector';
import {makeRandomString} from '../Utils/Utils';

import {PlotItemUpdateType} from '../TrescopeItem/Plot/PlotItem';
import {loadTrescopeItem} from '../TrescopeItem';
import {withStyles} from '@material-ui/styles/index';

class MainContainer extends React.Component {
    constructor(props) {
        super(props);

        this.webSocketClient = props.webSocketClient;

        this.plotResetListener = () => this.setState({rows: 0, columns: 0, outputs: new Map()});
        this.state = {rows: 0, columns: 0, outputs: new Map()};

        this.webSocketClient.setFunctionListener(
            'initializeOutput',
            (grid, finish) => {
                this.setState((state) => {
                    const {outputId, output, resolutionRow, resolutionColumn} = grid;

                    const {outputs} = state;
                    outputs.set(outputId, output);
                    finish();
                    return {rows: resolutionRow, columns: resolutionColumn, outputs};
                });
            }
        );

        this.webSocketClient.setFunctionListener(
            'clearOutput',
            ({outputId}, finish) =>
                this.setState((state) => {
                    let region = state.outputs.get(outputId);
                    Object.assign(region, {
                        gridRenderer: {
                            rendererType: 'plotly',
                            trescopeItemRenderer: {
                                data: [],
                                version: '',
                                layout: region.gridRenderer.trescopeItemRenderer.layout,
                                layoutSnapshot: region.gridRenderer.trescopeItemRenderer.layoutSnapshot,
                            },
                        },
                    });
                    finish();
                    return state;
                })
        );

        this.webSocketClient.setFunctionListener(
            'addControl',
            ({trace, outputId,}, finish) => this.setState((state) => {
                const {gridRenderer} = state.outputs.get(outputId);
                gridRenderer.rendererType = 'control';
                gridRenderer.trescopeItemRenderer.data = [...gridRenderer.trescopeItemRenderer.data, trace];
                gridRenderer.trescopeItemRenderer.version = makeRandomString(5);
                gridRenderer.trescopeItemRenderer.outputId = outputId;
                gridRenderer.trescopeItemRenderer.setInputData = data => this.props.inputDatas.set(outputId, {...this.props.inputDatas.get(outputId), ...data});
                finish();
                return state;
            })
        );

        //normal plotly
        this.webSocketClient.setMultipleFunctionListeners(
            [
                'plotHistogram', 'plotViolin', 'plotScatter3D', 'plotScatter2D', 'plotMesh3D', 'plotWireframe3D', 'plotVectorField3D',
                'plotLollipop3D', 'plotHeatMap', 'plotSurface3D', 'plotVolume3D', 'plotAxisHelper3D', 'plotLineSegment',
                'plotPie', 'updateLayout',
            ],
            (grid, finish) => {
                const {outputId, trace, layout = {}} = grid;
                this.setState((state) => {
                    const {gridRenderer} = state.outputs.get(outputId);

                    gridRenderer.rendererType = 'plotly';

                    if (gridRenderer.trescopeItemRenderer.data.length === 0 && trace) {
                        gridRenderer.trescopeItemRenderer.updateType = PlotItemUpdateType.newPlot;
                        gridRenderer.trescopeItemRenderer.data = [trace];
                        gridRenderer.trescopeItemRenderer.layout = {...gridRenderer.trescopeItemRenderer.layout, ...layout};
                    } else { //update data
                        const isAppendData = trace && Object.keys(trace).length > 0;
                        const isReLayout = Object.keys(layout).length > 0;

                        if (isAppendData && isReLayout) {//both update
                            gridRenderer.trescopeItemRenderer.updateType = PlotItemUpdateType.appendDataAndRelayout;
                            gridRenderer.trescopeItemRenderer.data = [...gridRenderer.trescopeItemRenderer.data, trace];
                            gridRenderer.trescopeItemRenderer.layout = layout;
                        } else if (isAppendData) {//append data
                            gridRenderer.trescopeItemRenderer.updateType = PlotItemUpdateType.appendData;
                            gridRenderer.trescopeItemRenderer.data = [...gridRenderer.trescopeItemRenderer.data, trace];
                        } else {//relayout
                            gridRenderer.trescopeItemRenderer.updateType = PlotItemUpdateType.relayout;
                            gridRenderer.trescopeItemRenderer.layout = layout;
                        }
                    }

                    gridRenderer.trescopeItemRenderer.version = makeRandomString(5);
                    gridRenderer.trescopeItemRenderer.outputId = outputId;

                    finish();
                    return state;
                });
            }
        );

        this.webSocketClient.setMultipleFunctionListeners(
            ['plotFRONT3D'],
            (grid, finish) => {
                const {outputId, trace, layout = {}} = grid;
                this.setState((state) => {
                    const {gridRenderer} = state.outputs.get(outputId);
                    gridRenderer.rendererType = 'FRONT3D';
                    gridRenderer.trescopeItemRenderer.data = trace;
                    gridRenderer.trescopeItemRenderer.layout = {...gridRenderer.trescopeItemRenderer.layout, ...layout};
                    gridRenderer.trescopeItemRenderer.version = makeRandomString(5);
                    gridRenderer.trescopeItemRenderer.outputId = outputId;
                    finish();
                    return state;
                });
            }
        );

        this.webSocketClient.setFunctionListener('plotImage', ({outputId, trace}, finish) =>
            this.setState((state) => {
                const {gridRenderer} = state.outputs.get(outputId);
                gridRenderer.rendererType = 'image';
                gridRenderer.trescopeItemRenderer.data = [trace];
                gridRenderer.trescopeItemRenderer.version = makeRandomString(5);
                gridRenderer.trescopeItemRenderer.outputId = outputId;
                finish();
                return state;
            }));

        this.webSocketClient.setFunctionListener('plotGraph', ({outputId, trace}, finish) =>
            this.setState((state) => {
                const {gridRenderer} = state.outputs.get(outputId);
                gridRenderer.rendererType = 'graph';
                gridRenderer.trescopeItemRenderer.data = [trace];
                gridRenderer.trescopeItemRenderer.version = makeRandomString(5);

                finish();
                return state;
            }));

        /* this.webSocketClient.setFunctionListener('plotModel3D', ({outputId, trace}, finish) =>
             this.setState((state) => {
                 const {gridRenderer} = state.outputs.get(outputId);
                 gridRenderer.rendererType = 'vanilla_three';
                 gridRenderer.trescopeItemRenderer.data = [...gridRenderer.trescopeItemRenderer.data, trace];
                 gridRenderer.trescopeItemRenderer.version = makeRandomString(5);

                 finish();
                 return state;
             }));*/
    }

    componentWillMount() {
        window.addEventListener('trescope-plot-reset', this.plotResetListener);
    }

    componentWillUnmount() {
        window.removeEventListener('trescope-plot-reset', this.plotResetListener);
    }

    render() {
        const gridGap = 4;
        const {width, classes} = this.props;
        const gridSideLength = (width - gridGap * (this.state.columns - 1)) / this.state.columns;

        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${this.state.rows},${gridSideLength}px)`,
                    gridTemplateColumns: `repeat(${this.state.columns},${gridSideLength}px)`,
                    gridColumnGap: `${gridGap}px`,
                    gridRowGap: `${gridGap}px`,
                }}
            >
                {[...this.state.outputs.entries()].map(
                    ([outputId, {gridLayout: {rowStart, columnStart, rowSpan, columnSpan, size}, gridRenderer}]) => {
                        const outputRef = React.createRef();
                        return (
                            <Paper
                                ref={outputRef}
                                key={outputId}
                                className={classes.output}
                                style={{
                                    gridRow: `${rowStart + 1} / span ${rowSpan}`,
                                    gridColumn: `${columnStart + 1} /span ${columnSpan}`,
                                    overflow: 'auto',
                                }}>
                                <Chip
                                    label={`${outputId}`}
                                    size='small'
                                    variant='outlined'
                                    className={classes.outputId}/>
                                <>
                                    {loadTrescopeItem(gridRenderer.rendererType, gridRenderer.trescopeItemRenderer, {
                                        width: size.width,
                                        height: size.height
                                    })}
                                </>
                                <ReactResizeDetector
                                    handleWidth handleHeight
                                    onResize={(width, height) =>
                                        this.setState((state) => {
                                            size.width = outputRef.current.clientWidth;
                                            size.height = outputRef.current.clientHeight;
                                            return state;
                                        })
                                    }/>
                            </Paper>
                        );
                    }
                )}
            </div>
        );
    }
}

export default withStyles((theme) => ({
    output: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: theme.spacing(1) * .5,
        position: 'relative',
    },
    outputId: {
        position: 'absolute',
        left: theme.spacing(1), top: theme.spacing(1),
        zIndex: 1001,
        backgroundColor: 'white',
    }
}))(MainContainer);
