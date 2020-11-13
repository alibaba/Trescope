import React from "react";
import Paper from "@material-ui/core/Paper";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/styles";

import {voidOperate} from "../Utils/Utils";
import CloudOffTwoToneIcon from '@material-ui/icons/CloudOffTwoTone';
import CloudQueueTwoToneIcon from '@material-ui/icons/CloudQueueTwoTone';
import Divider from '@material-ui/core/Divider';

class ControlBar extends React.Component {
    constructor(props) {
        super(props);

        this.resetListener = () => {
            this.setState({
                continueBreakPoint: voidOperate,
                disableContinue: true,
                currentIdentifier: "",
            });
        };

        this.state = {
            serverConnected: undefined,
            continueBreakPoint: voidOperate,
            disableContinue: true,
            currentIdentifier: "",
        };
        const {webSocketClient} = props;
        this.webSocketClient = webSocketClient;
        this.webSocketClient.addEventListener((eventName, _) => {
            if ('close' === eventName || 'error' === eventName) {
                this.setState({serverConnected: false});
                return;
            }
            if ('open' === eventName) {
                this.setState({serverConnected: true});
                return;
            }
        });

        this.webSocketClient.setFunctionListener(
            "breakPoint",
            ({identifier}, finish) => {
                this.setState({
                    disableContinue: false,
                    currentIdentifier: identifier,
                    continueBreakPoint: () => {
                        this.setState({
                            continueBreakPoint: voidOperate,
                            disableContinue: true,
                            currentIdentifier: "",
                        });

                        const mapObj = Array.from(props.inputDatas).reduce((obj, [key, value]) => {
                            obj[key] = value;
                            return obj;
                        }, {});
                        finish({inputDatas: mapObj});
                    },
                });
            }
        );
    }

    componentWillMount() {
        window.addEventListener('trescope-plot-reset', this.resetListener);
    }

    componentWillUnmount() {
        window.removeEventListener('trescope-plot-reset', this.resetListener);
    }

    render() {
        const {classes} = this.props;
        let serverConnected = undefined === this.state.serverConnected ? this.webSocketClient.alive() : this.state.serverConnected;

        return (
            <Paper className={classes.root}>
                <Grid
                    container
                    className={classes.root}
                    spacing={2}
                    alignItems="center"
                    wrap="nowrap"
                >
                    <Grid item>
                        {serverConnected ? <CloudQueueTwoToneIcon color="primary"/> :
                            <CloudOffTwoToneIcon color="secondary"/>}
                    </Grid>
                    <Divider orientation="vertical" flexItem className={classes.divider}/>
                    <Grid item>
                        <Typography component="h6" variant="h6">
                            CurrentBreakPoint
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component="p">
                            {this.state.currentIdentifier}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={this.state.disableContinue}
                            onClick={this.state.continueBreakPoint}
                        >
                            continue
                            <Icon className={classes.continueIcon}>
                                play_arrow
                            </Icon>
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles((theme) => ({
    root: {
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    divider: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
    continueIcon: {
        marginLeft: theme.spacing(1),
    },
}))(ControlBar);
