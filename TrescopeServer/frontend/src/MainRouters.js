import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {withStyles} from "@material-ui/styles";
import WebSocketClient from "./Utils/WebSocketClient";
import MainContainer from "./Container/MainContainer";

import ControlBar from "./Container/ControlBar";

function Router(props) {
    const {children, value, index, ...other} = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box marginTop={5}>{children}</Box>
        </Typography>
    );
}

Router.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const styles = (theme) => ({
    root: {
        // flexGrow: 1,
    },
});

class MainRouters extends React.Component {
    onTabSelected = (event, newTabIndex) => this.setState({tabIndex: newTabIndex});
    inputDatas = new Map();

    constructor(props) {
        super(props);
        this.state = {tabIndex: 0, appBarHeight: 0};
        const debugBackendPort = new URL(window.location.href).searchParams.get("debug");
        const uri = debugBackendPort
            ? `ws://localhost:${debugBackendPort}`
            : `ws://${window.location.host}`;
        this.webSocketClient = new WebSocketClient(uri);
        this.webSocketClient.setFunctionListener("resetPlot", (command, finish) => {
                window.dispatchEvent(new Event('trescope-plot-reset'));
                finish();
            }
        );
    }

    componentDidMount() {
        let {clientHeight} = this.refs.appBar;
        this.setState({appBarHeight: clientHeight});
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <AppBar ref="appBar">
                    <Tabs
                        value={this.state.tabIndex}
                        onChange={this.onTabSelected}
                        aria-label="tabs"
                    >
                        <Tab label="Plot" {...a11yProps(0)} />
                    </Tabs>
                </AppBar>

                <Router value={this.state.tabIndex} index={0}>
                    <div
                        style={{
                            position: "sticky",
                            top: this.state.appBarHeight,
                            zIndex: 10001,
                        }}
                    >
                        <ControlBar
                            inputDatas={this.inputDatas}
                            webSocketClient={this.webSocketClient}
                        />
                    </div>

                    <MainContainer
                        inputDatas={this.inputDatas}
                        webSocketClient={this.webSocketClient}
                    />
                </Router>
            </div>
        );
    }
}

MainRouters.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainRouters);
