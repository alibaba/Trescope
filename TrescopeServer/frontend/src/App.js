import React from "react";
import "./App.css";
import {ThemeProvider} from "@material-ui/styles";
import {createMuiTheme} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import MainRouters from "./MainRouters";

const theme = createMuiTheme();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <MainRouters/>
        </ThemeProvider>
    );
}

export default App;
