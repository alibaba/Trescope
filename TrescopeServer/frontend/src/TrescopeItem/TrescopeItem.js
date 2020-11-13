import React from "react";
import PlotItem from "./Plot/PlotItem";
import GraphItem from "./Graph/GraphItem";
import FRONT3DItem from "./FRONT3D/FRONT3DItem";
import ControlItem from "./Control/ControlItem";
import ImageItem from "./Image/ImageItem";

class TrescopeItem extends React.Component {
    currentWidth = 0;
    currentHeight = 0;
    currentVersion = "";

    getElementByType(rendererType, itemRenderer) {
        switch (rendererType) {
            case "plotly":
                return <PlotItem itemRenderer={itemRenderer} size={this.props.size}/>;
            case 'image':
                return <ImageItem itemRenderer={itemRenderer} size={this.props.size}/>;
            case "FRONT3D":
                return <FRONT3DItem itemRenderer={itemRenderer} size={this.props.size}/>;
            case 'control':
                return <ControlItem itemRenderer={itemRenderer} size={this.props.size}/>;
            case "graph":
                return <GraphItem itemRenderer={itemRenderer} size={this.props.size}/>;
            default:
                return null;
        }
    }

    shouldComponentUpdate(nextProps) {
        const versionComparison = this.currentVersion !== nextProps.trescopeItemData.trescopeItemRenderer.version;
        const sizeComparison =
            Math.abs(this.currentWidth - nextProps.size.width) > 0.0 ||
            Math.abs(this.currentHeight - nextProps.size.height) > 0.0;

        this.currentWidth = nextProps.size.width;
        this.currentHeight = nextProps.size.height;
        this.currentVersion = nextProps.trescopeItemData.trescopeItemRenderer.version;

        return versionComparison || sizeComparison;
    }

    render() {
        const {rendererType, trescopeItemRenderer} = this.props.trescopeItemData;
        if (Object.keys(trescopeItemRenderer.data).length <= 0) return null;
        return this.getElementByType(rendererType, trescopeItemRenderer);
    }
}

export default TrescopeItem;
