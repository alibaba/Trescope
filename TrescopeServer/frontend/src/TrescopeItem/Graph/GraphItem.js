import React from "react";
import GraphItemInner from "./GraphItemInner";

class GraphItem extends React.Component {
    shouldComponentUpdate(nextProps) {
        const { itemRenderer, width, height } = this.props;
        if (
            nextProps.itemRenderer.version !== itemRenderer.version ||
            nextProps.width !== width ||
            nextProps.height !== height
        )
            return true;
        return false;
    }

    render() {
        const { itemRenderer, width, height } = this.props;
        return (
            <GraphItemInner
                itemRenderer={itemRenderer}
                width={width}
                height={height}
            ></GraphItemInner>
        );
    }
}

export default GraphItem;
