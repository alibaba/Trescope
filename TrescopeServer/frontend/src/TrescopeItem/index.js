import React from "react";
import PlotItem from "./Plot/PlotItem";
import GraphItem from "./Graph/GraphItem";
import FRONT3DItem from "./FRONT3D/FRONT3DItem";
import ControlItemContainer from "./Control/ControlItemContainer";
import ImageItem from "./Image/ImageItem";
import VanillaThreeItem from './VanillaThree/VanillaThreeItem'

export function loadTrescopeItem(rendererType, itemRenderer, size) {
    if (Object.keys(itemRenderer.data).length <= 0) return null;
    switch (rendererType) {
        case "plotly":
            return <PlotItem itemRenderer={itemRenderer} size={size}/>;
        case 'image':
            return <ImageItem itemRenderer={itemRenderer} size={size}/>;
        case "FRONT3D":
            return <FRONT3DItem itemRenderer={itemRenderer} size={size}/>;
        case 'control':
            return <ControlItemContainer itemRenderer={itemRenderer} size={size}/>;
        case "graph":
            return <GraphItem itemRenderer={itemRenderer} size={size}/>;
        case 'vanilla_three':
            return <VanillaThreeItem itemRenderer={itemRenderer} size={size}/>;
        default:
            return null;
    }
}
