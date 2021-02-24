import React from "react";
import Chip from '@material-ui/core/Chip';
import {withStyles} from "@material-ui/styles/index";
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import {copyTextToClipboard} from "../../Utils/Utils";
import Snackbar from '@material-ui/core/Snackbar';

class VisualDataPickControl extends React.Component {
    deleteData = (dataToDelete) => () => this.setState(state => {
        state.dataList = state.dataList.filter((data) => data.key !== dataToDelete.key);
        const {id} = this.props.trace;
        const setInputData = this.props.setInputData;
        setInputData({[id]: state.dataList.map(e => e.value.data)});

        dataToDelete.unpickNotify();
        return state;
    });

    constructor(props) {
        super(props);
        const {id, attachOutput, colorWhenPicked, value} = this.props.trace;
        const setInputData = this.props.setInputData;
        setInputData({[id]: []});
        this.state = {dataList: [], showTips: false};

        window.dispatchEvent(new CustomEvent('trescope-control-attach', {
            detail: {
                controlId: id,
                outputId: attachOutput,
                colorWhenPicked, value
            }
        }));
    }

    onVisualDataPicked = (event) => {
        const {detail: {outputId, controlId, value: {name, data}, uid, unpickNotify}} = event;
        const {id, attachOutput} = this.props.trace;
        if (attachOutput !== outputId || id !== controlId) return;

        if (this.state.dataList.some(data => data.key === uid)) return;

        this.setState(state => {
            state.dataList.push({key: uid, value: {name, data}, unpickNotify});
            const setInputData = this.props.setInputData;
            setInputData({[id]: state.dataList.map(element => element.value.data)});
            return state;
        });
    };

    componentWillMount() {
        window.addEventListener("trescope-visual-data-picked", this.onVisualDataPicked);
    }

    componentWillUnmount() {
        window.removeEventListener("trescope-visual-data-picked", this.onVisualDataPicked);
    }

    render() {
        const {attachOutput, label} = this.props.trace;
        const {classes} = this.props;
        return <div>
            <Tooltip title={`attachOutput: ${attachOutput}`}>
                <Typography variant="caption">{label}</Typography>
            </Tooltip>
            <ul className={classes.ul}>
                {this.state.dataList.map((data) => {
                    return (
                        <li key={`${data.key}`}>
                            <Chip
                                color="primary"
                                size="small"
                                label={data.value.name}
                                onDelete={this.deleteData(data)}
                                onDoubleClick={() => {
                                    copyTextToClipboard(data.value.data, () => this.setState({showTips: true}), error => console.log('Copy fail:', error));
                                    window.setTimeout(() => this.setState({showTips: false}), 1200);
                                }}
                                className={classes.chip}
                            />
                        </li>);
                })}
            </ul>
            <Divider style={{marginBottom: '8px', marginTop: '4px'}}/>
            <Snackbar
                open={this.state.showTips}
                message="Copied to clipboard!"
                key={`${this.props.trace.id}`}
            />
        </div>;
    }
}


export default withStyles((theme) => ({
    ul: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}))(VisualDataPickControl);
