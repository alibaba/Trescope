import React from "react";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';


class ControlItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    createControlContentByType({id, label, type, value, enumeration}) {
        const setInputData = this.props.itemRenderer.setInputData;
        if (!this.state[id]) {
            this.setState(state => {
                state[id] = value;
                setInputData(state);
                return state;
            });
        }

        switch (type) {
            case 'EnumControl':
                return <div>
                    <Typography variant="caption" display="block">{label}</Typography>
                    <ButtonGroup variant="contained" color="primary">
                        {enumeration.map(
                            enum_ => <Button
                                key={`${id}-${enum_}`}
                                style={{
                                    textTransform: 'none',
                                    color: enum_ === this.state[id] ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
                                    backgroundColor: enum_ === this.state[id] ? '#3f51b5' : '#e0e0e0'
                                }}
                                size="small"
                                onClick={() => this.setState(state => {
                                    state[id] = enum_;
                                    setInputData(state);
                                    return state;
                                })}>{enum_}</Button>)}
                    </ButtonGroup>
                </div>;
            default:
                return null;
        }
    }

    render() {
        const data = this.props.itemRenderer.data;

        return <div>
            {data.map(trace =>
                <div key={`${trace.id}`} style={{marginBottom: '4px'}}>{this.createControlContentByType(trace)}</div>)}
        </div>;
    }
}

export default ControlItem;
