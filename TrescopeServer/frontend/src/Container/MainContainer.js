import React from "react";
import TrescopeItem from "../TrescopeItem/TrescopeItem";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import ReactResizeDetector from "react-resize-detector";
import {makeRandomString} from "../Utils/Utils";

import {PlotItemUpdateType} from "../TrescopeItem/Plot/PlotItem";

class MainContainer extends React.Component {
    constructor(props) {
        super(props);

        this.webSocketClient = props.webSocketClient;

        this.resetListener = () => this.setState({rows: 0, columns: 0, gridSideLength: 0, regions: new Map()});
        this.state = {rows: 0, columns: 0, gridSideLength: 0, regions: new Map()};

        const idToKey = (outputId) => `${outputId}`;
        this.webSocketClient.setFunctionListener(
            "initializeOutput",
            (grid, finish) => {
                this.setState((state) => {
                    const {outputId, output, resolutionRow, resolutionColumn} = grid;

                    const {regions} = state;
                    regions.set(idToKey(outputId), output);
                    finish();
                    return {rows: resolutionRow, columns: resolutionColumn, regions};
                });
            }
        );

        this.webSocketClient.setFunctionListener(
            "clearOutput",
            ({outputId}, finish) =>
                this.setState((state) => {
                    let region = state.regions.get(idToKey(outputId));
                    Object.assign(region, {
                        gridRenderer: {
                            rendererType: "plotly",
                            trescopeItemRenderer: {
                                data: [],
                                version: "",
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
            "addControl",
            ({trace, outputId,}, finish) => this.setState((state) => {
                const {gridRenderer} = state.regions.get(idToKey(outputId));
                gridRenderer.rendererType = "control";
                gridRenderer.trescopeItemRenderer.data = [...gridRenderer.trescopeItemRenderer.data, trace];
                gridRenderer.trescopeItemRenderer.version = makeRandomString(5);
                gridRenderer.trescopeItemRenderer.outputId = idToKey(outputId);
                gridRenderer.trescopeItemRenderer.setInputData = data => this.props.inputDatas.set(outputId, {...this.props.inputDatas.get(outputId), ...data});
                finish();
                return state;
            })
        );

        //normal plotly
        this.webSocketClient.setMultipleFunctionListeners(
            [
                "plotHistogram",
                "plotViolin",
                "plotScatter3D",
                "plotScatter2D",
                "plotMesh3D",
                "plotVectorField3D",
                "plotLollipop3D",
                "plotHeatMap",
                "plotSurface3D",
                "plotVolume3D",
                "updateLayout",
            ],
            (grid, finish) => {
                const {outputId, trace, layout = {}} = grid;
                this.setState((state) => {
                    const {gridRenderer} = state.regions.get(idToKey(outputId));

                    gridRenderer.rendererType = "plotly";

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
                            gridRenderer.trescopeItemRenderer.layout = {...gridRenderer.trescopeItemRenderer.layout, ...layout};
                        } else if (isAppendData) {//append data
                            gridRenderer.trescopeItemRenderer.updateType = PlotItemUpdateType.appendData;
                            gridRenderer.trescopeItemRenderer.data = [...gridRenderer.trescopeItemRenderer.data, trace];
                        } else {//relayout
                            gridRenderer.trescopeItemRenderer.updateType = PlotItemUpdateType.relayout;
                            gridRenderer.trescopeItemRenderer.layout = {...gridRenderer.trescopeItemRenderer.layout, ...layout};
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
            ["plotFRONT3D"],
            (grid, finish) => {
                const {outputId, trace, layout = {}} = grid;
                this.setState((state) => {
                    const {gridRenderer} = state.regions.get(idToKey(outputId));
                    gridRenderer.rendererType = "FRONT3D";
                    gridRenderer.trescopeItemRenderer.data = trace;
                    gridRenderer.trescopeItemRenderer.layout = {...gridRenderer.trescopeItemRenderer.layout, ...layout};
                    gridRenderer.trescopeItemRenderer.version = makeRandomString(5);
                    gridRenderer.trescopeItemRenderer.outputId = outputId;
                    finish();
                    return state;
                });
            }
        );

        this.webSocketClient.setFunctionListener(
            "plotImage",
            ({outputId, trace}, finish) => {
                this.setState((state) => {
                    const {gridRenderer} = state.regions.get(idToKey(outputId));
                    gridRenderer.rendererType = "image";
                    gridRenderer.trescopeItemRenderer.data = [trace];
                    gridRenderer.trescopeItemRenderer.version = makeRandomString(5);
                    finish();
                    return state;
                });
            }
        );
        this.webSocketClient.setFunctionListener(
            "plotGraph",
            ({outputId, graphData}, finish) =>
                this.setState((state) => {
                    const {gridRenderer} = state.regions.get(idToKey(outputId));
                    gridRenderer.rendererType = "graph";
                    gridRenderer.trescopeItemRenderer.graphData = graphData;
                    gridRenderer.trescopeItemRenderer.version = makeRandomString(5);

                    finish();
                    return state;
                })
        );
    }

    componentWillMount() {
        window.addEventListener("trescope-plot-reset", this.resetListener);
    }

    componentWillUnmount() {
        window.removeEventListener("trescope-plot-reset", this.resetListener);
    }

    render() {
        const gridGap = 4;
        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateRows: `repeat(${this.state.rows},${this.state.gridSideLength}px)`,
                    gridTemplateColumns: `repeat(${this.state.columns},${this.state.gridSideLength}px)`,
                    gridColumnGap: `${gridGap}px`,
                    gridRowGap: `${gridGap}px`,
                }}
            >
                {[...this.state.regions.entries()].map(
                    ([regionKey, {gridLayout: {rowStart, columnStart, rowSpan, columnSpan, size}, gridRenderer}]) => {
                        const regionRef = React.createRef();
                        return (
                            <Paper
                                ref={regionRef}
                                key={regionKey}
                                style={{
                                    gridRow: `${rowStart + 1} / span ${rowSpan}`,
                                    gridColumn: `${columnStart + 1} /span ${columnSpan}`,
                                    overflow: "auto",

                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: "4px",
                                    position: "relative",
                                }}
                            >
                                <Chip
                                    label={`${regionKey}`}
                                    size="small"
                                    variant="outlined"
                                    style={{
                                        position: "absolute",
                                        left: "8px", top: "8px",
                                        zIndex: 1001,
                                        backgroundColor: "white",
                                    }}
                                />
                                <TrescopeItem trescopeItemData={gridRenderer} size={size}/>
                                <ReactResizeDetector
                                    handleWidth handleHeight
                                    onResize={(width, height) =>
                                        this.setState((state) => {
                                            size.width = regionRef.current.clientWidth;
                                            size.height = regionRef.current.clientHeight;
                                            return state;
                                        })
                                    }
                                />
                            </Paper>
                        );
                    }
                )}

                <ReactResizeDetector
                    handleWidth handleHeight
                    onResize={(width, height) => {
                        this.setState((state) => {
                            state.gridSideLength = (width - gridGap * (this.state.columns - 1)) / this.state.columns;
                            return state;
                        });
                    }}
                />
            </div>
        );
    }
}

export default MainContainer;
