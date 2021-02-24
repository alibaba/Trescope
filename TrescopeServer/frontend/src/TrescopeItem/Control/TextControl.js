import React from "react";
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';


class EnumControl extends React.Component {
    handleChange = (event) => {
        const {id} = this.props.trace;
        const state = {data: {[id]: event.target.value}};
        this.setState(state);
        const setInputData = this.props.setInputData;
        setInputData(state['data']);
    };

    constructor(props) {
        super(props);
        const {id, value} = this.props.trace;
        const setInputData = this.props.setInputData;
        this.state = {
            data: {[id]: value},
        };
        setInputData(this.state.data);
    }


    render() {
        const {id, label} = this.props.trace;
        return <div>
            <TextField
                id={id}
                label={label}
                multiline
                value={this.state.data[id]}
                onChange={this.handleChange}
                style={{width: '100%'}}
            />
            <Divider style={{marginBottom: '8px', marginTop: '4px'}}/>
        </div>;
    }
}

export default EnumControl;
