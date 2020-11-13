import React from "react";
import * as Plotly from "plotly.js/dist/plotly";

export const PlotItemUpdateType = {
    newPlot: "newPlot",
    appendData: "appendData",
    relayout: "relayout",
    appendDataAndRelayout: "appendDataAndRelayout",
};

class PlotItem extends React.Component {
    currentVersion = "";

    constructor(props) {
        super(props);
        const {version} = props.itemRenderer;
        this.currentVersion = version;
        this.container = React.createRef();
    }

    render() {
        return (
            <div
                ref={this.container}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
        );
    }

    getLayoutWithPropsData() {
        return {...this.props.itemRenderer.layout, ...this.props.size};
    }

    shouldComponentUpdate(preProps) {
        const {version} = this.props.itemRenderer;

        if (version && this.currentVersion !== version) {
            this.currentVersion = this.props.itemRenderer.version;
            return true;
        } else {
            return false;
        }
    }

    componentDidUpdate() {
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
                if (Array.isArray(data) && data.length > 0) {
                    Plotly.addTraces(container, data[data.length - 1]);
                }

                break;
            }
            case PlotItemUpdateType.relayout: {
                let layout = this.getLayoutWithPropsData();
                Plotly.relayout(container, layout);
                break;
            }
            case PlotItemUpdateType.appendDataAndRelayout: {
                const {data} = this.props.itemRenderer;
                if (Array.isArray(data) && data.length > 0) {
                    Plotly.addTraces(container, data[data.length - 1]);
                }

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
    }
}

export default PlotItem;
