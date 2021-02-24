import React from "react";
import * as Plotly from "plotly.js/dist/plotly";
import {copyTextToClipboard} from "../../Utils/Utils";
import Snackbar from '@material-ui/core/Snackbar';

export const PlotItemUpdateType = {
    newPlot: "newPlot",
    appendData: "appendData",
    relayout: "relayout",
    appendDataAndRelayout: "appendDataAndRelayout",
};

function getUpdate(fullData, colorToUpdate) {
    switch (fullData.type) {
        case 'mesh3d':
            return {'color': colorToUpdate};
        case 'scatter3d': {
            let _ = {};
            if (fullData.mode.includes('markers')) _['marker.color'] = colorToUpdate;
            if (fullData.mode.includes('lines')) _['line.color'] = colorToUpdate;
            return _;
        }
        default:
            return undefined;
    }
}

function queryColor(fullData) {
    switch (fullData.type) {
        case 'mesh3d':
            return fullData.color;
        case 'scatter3d': {
            if (fullData.mode.includes('markers')) return fullData.marker.color;
            if (fullData.mode.includes('lines')) return fullData.line.color;
            return undefined;
        }
        default:
            return undefined;
    }
}

class PlotItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {showTips: false};
        this.showTipsPending = false;
        this.sizeChnagePending = false;
        this.container = React.createRef();
        this.controlAttached = null;
        this.pickedData = null;
        this.colorWhenPicked = null;

        this.version = this.props.itemRenderer.version;
        this.size = {...this.props.size};
    }

    tryToSendPickedData = (timeInterval) => {
        try {
            if (timeInterval > 200) return;
            if (null === this.controlAttached) return;
            const data = this.pickedData;
            if (!data) return;
            if (`trace ${data.points[0].fullData.index}` === data.points[0].fullData.name) return;//No customized name
            if ('mesh3d' !== data.points[0].fullData.type && 'scatter3d' !== data.points[0].fullData.type) return;//Only support mesh3d , scatter3d now

            const container = this.container.current;

            window.dispatchEvent(new CustomEvent('trescope-visual-data-picked', {
                detail: {
                    uid: data.points[0].fullData.uid,
                    value: {
                        name: data.points[0].fullData.name,
                        data: data.points[0].fullData.name,
                    },
                    unpickNotify: () => Plotly.restyle(container,
                        getUpdate(data.points[0].fullData, queryColor(data.points[0].fullData)),
                        data.points[0].fullData.index),
                    outputId: this.props.itemRenderer.outputId,
                    controlId: this.controlAttached
                }
            }));
            const update = getUpdate(data.points[0].fullData, this.colorWhenPicked);
            Plotly.restyle(container, update, data.points[0].fullData.index);
        } catch (e) {
            console.error('tryToSendPickedData.error', e);
        } finally {
            this.pickedData = null;
        }
    };

    render() {
        let downTime;
        return (
            <div style={{...this.props.size}}>
                <div
                    onMouseDown={event => downTime = event.timeStamp}
                    onMouseUp={event => this.tryToSendPickedData(event.timeStamp - downTime)}
                    ref={this.container}
                    style={{...this.props.size}}
                />
                <Snackbar
                    open={this.state.showTips}
                    message="Copied to clipboard!"
                    key={`${ this.props.itemRenderer.outputId}`}
                />
            </div>
        );
    }

    getLayoutWithPropsData() {
        return {...this.props.itemRenderer.layout, clickmode: 'event+select', hovermode: 'closest', ...this.props.size};
    }

    shouldComponentUpdate(nextProps, nextState) {
        const curVersion = this.version;
        const nextVersion = nextProps.itemRenderer.version;
        if (curVersion !== nextVersion) {
            this.version = nextProps.itemRenderer.version;
            this.size = {...nextProps.size};
            return true;
        }

        if (nextState.showTips !== this.state.showTips) {
            this.showTipsPending = true;
            return true;
        }

        const curWidth = this.size.width;
        const nextWidth = nextProps.size.width;
        const curHeight = this.size.height;
        const nextHeight = nextProps.size.height;
        if (curWidth !== nextWidth || curHeight !== nextHeight) {
            this.sizeChnagePending = true;
            this.version = nextProps.itemRenderer.version;
            this.size = {...nextProps.size};
            return true;
        }
        this.version = nextProps.itemRenderer.version;
        this.size = {...nextProps.size};
        return false;
    }

    componentDidUpdate() {
        if (this.showTipsPending) {
            this.showTipsPending = false;
            return;
        }

        if (this.sizeChnagePending) {
            this.sizeChnagePending = false;
            Plotly.relayout(this.container.current, {...this.getLayoutWithPropsData()});
            return;
        }


        const {updateType} = this.props.itemRenderer;
        const container = this.container.current;
        switch (updateType) {
            case PlotItemUpdateType.newPlot: {
                let layout = this.getLayoutWithPropsData();
                Plotly.newPlot(container, this.props.itemRenderer.data, layout, {displaylogo: false});
                break;
            }
            case PlotItemUpdateType.appendData: {
                const {data} = this.props.itemRenderer;
                if (Array.isArray(data) && data.length > 0) Plotly.addTraces(container, data[data.length - 1]);
                break;
            }
            case PlotItemUpdateType.relayout: {
                let layout = this.getLayoutWithPropsData();
                Plotly.relayout(container, layout);
                break;
            }
            case PlotItemUpdateType.appendDataAndRelayout: {
                const {data} = this.props.itemRenderer;
                if (Array.isArray(data) && data.length > 0) Plotly.addTraces(container, data[data.length - 1]);

                let layout = this.getLayoutWithPropsData();
                Plotly.relayout(container, layout);
                break;
            }
            default:
                break;
        }
    }

    componentDidMount() {
        const layout = this.getLayoutWithPropsData();
        const container = this.container.current;
        Plotly.newPlot(container, this.props.itemRenderer.data, layout, {displaylogo: false});
        container.on('plotly_click', data => this.pickedData = data);
        container.on('plotly_legenddoubleclick', data => {
            const traceName = data.fullData[data.curveNumber].name;
            copyTextToClipboard(traceName, () => this.setState({showTips: true}), error => console.log('Copy fail:', error));
            window.setTimeout(() => this.setState({showTips: false}), 1200);
            return true;
        });
    }

    controlAttach = (event) => {
        const {controlId, outputId, colorWhenPicked} = event.detail;
        if (this.props.itemRenderer.outputId !== outputId) return;

        this.controlAttached = controlId;
        this.colorWhenPicked = colorWhenPicked;
    };

    componentWillMount() {
        window.addEventListener("trescope-control-attach", this.controlAttach);
    }

    componentWillUnmount() {
        window.removeEventListener("trescope-control-attach", this.controlAttach);
    }
}

export default PlotItem;
