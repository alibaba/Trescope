import React from "react";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Divider from '@material-ui/core/Divider';
import {copyTextToClipboard} from "../../Utils/Utils";


class EnumControl extends React.Component {
    constructor(props) {
        super(props);
        const {id, value, enumeration} = this.props.trace;
        const setInputData = this.props.setInputData;
        this.state = {
            data: {[id]: value === undefined ? '' : ('string' === (typeof enumeration[0]) ? value + '' : value)},
            showTips: false
        };
        setInputData(this.state.data);
    }


    render() {
        const {id, label, enumeration, style} = this.props.trace;
        const setInputData = this.props.setInputData;

        return <div>
            <Typography variant="caption" display="block">{label}</Typography>
            <ButtonGroup variant="contained" color="primary" orientation={style}>
                {enumeration.map(
                    enum_ => <Button
                        key={`${id}-${enum_}`}
                        style={{
                            textTransform: 'none',
                            color: enum_ === this.state.data[id] ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
                            backgroundColor: enum_ === this.state.data[id] ? '#3f51b5' : '#e0e0e0'
                        }}
                        size="small"
                        onDoubleClick={() => {
                            copyTextToClipboard(enum_, () => this.setState({showTips: true}), error => console.log('Copy fail:', error));
                            window.setTimeout(() => this.setState({showTips: false}), 1200);
                        }}
                        onClick={() => this.setState(state => {
                            state.data[id] = enum_;
                            setInputData(state.data);
                            return state;
                        })}>{enum_}</Button>)
                }
            </ButtonGroup>
            <Divider style={{marginBottom: '8px', marginTop: '4px'}}/>
            <Snackbar
                open={this.state.showTips}
                message="Copied to clipboard!"
                key={`${id}`}
            />
        </div>;
    }
}

export default EnumControl;
