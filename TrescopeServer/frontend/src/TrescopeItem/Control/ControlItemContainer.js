import React from "react";
import VisualDataPickControl from "./VisualDataPickControl";
import EnumControl from "./EnumControl";
import TextControl from "./TextControl";
import Label from "./Label";
import {withStyles} from "@material-ui/styles/index";


class ControlItemContainer extends React.Component {
    constructor(props) {
        super(props);
        this.version = this.props.itemRenderer.version;
        this.size = {...this.props.size};
    }

    createControlContentByType(trace) {
        const setInputData = this.props.itemRenderer.setInputData;
        switch (trace.type) {
            case 'EnumControl':
                return <EnumControl trace={trace} setInputData={setInputData}/>;
            case 'TextControl':
                return <TextControl trace={trace} setInputData={setInputData}/>;
            case 'VisualDataPickControl':
                return <VisualDataPickControl trace={trace} setInputData={setInputData}/>;
            case 'Label':
                return <Label trace={trace} setInputData={setInputData}/>;
            default:
                return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const curVersion = this.version;
        const nextVersion = nextProps.itemRenderer.version;
        if (curVersion !== nextVersion) {
            this.version = nextProps.itemRenderer.version;
            this.size = {...nextProps.size};
            return true;
        }
        const curWidth = this.size.width;
        const nextWidth = nextProps.size.width;
        const curHeight = this.size.height;
        const nextHeight = nextProps.size.height;
        this.version = nextProps.itemRenderer.version;
        this.size = {...nextProps.size};
        return curWidth !== nextWidth || curHeight !== nextHeight;
    }

    render() {
        const {classes} = this.props;
        const data = this.props.itemRenderer.data;
        return <div className={classes.container} style={{...this.props.size}}>
            {data.map(trace =>
                <div key={`${trace.id}`} style={{marginBottom: '4px'}}>{this.createControlContentByType(trace)}</div>)}
        </div>;
    }
}

export default withStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(1) * 4,
        paddingBottom: theme.spacing(1) * 3,
        paddingLeft: theme.spacing(1) * 3,
        paddingRight: theme.spacing(1) * 3,
    },
}))(ControlItemContainer);
