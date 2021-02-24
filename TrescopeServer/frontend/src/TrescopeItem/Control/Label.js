import React from "react";
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import * as Utils from "../../Utils/Utils";
import {copyTextToClipboard} from "../../Utils/Utils";
import Snackbar from '@material-ui/core/Snackbar';

function isHttpOrHttps(urlMaybe) {
    if (!urlMaybe) return false;
    return urlMaybe.startsWith('http://') || urlMaybe.startsWith('https://');
}

class Label extends React.Component {

    constructor(props) {
        super(props);
        const {id, value, label} = this.props.trace;
        const setInputData = this.props.setInputData;
        setInputData({[id]: value ? value : label});
        this.state = {showTips: false};
    }


    render() {
        const {label, value, id, openIfLink} = this.props.trace;
        const realValue = value ? value : label;
        return <div>
            <Chip
                size="small"
                label={label}
                clickable
                color="primary"
                onDoubleClick={() => {
                    copyTextToClipboard(realValue, () => this.setState({showTips: true}), error => console.log('Copy fail:', error));
                    window.setTimeout(() => this.setState({showTips: false}), 1200);
                }}
                onClick={isHttpOrHttps(realValue) && openIfLink ? () => {
                    const newTab = window.open(realValue, '_blank');
                    newTab.focus();
                } : Utils.voidOperate}
            />
            <Divider style={{marginBottom: '8px', marginTop: '4px'}}/>

            <Snackbar
                open={this.state.showTips}
                message="Copied to clipboard!"
                key={`${id}`}
            />
        </div>;
    }
}

export default Label;
