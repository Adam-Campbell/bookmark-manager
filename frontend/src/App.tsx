import { CssBaseline, ThemeProvider } from "@mui/material";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/work-sans";
import theme from "./theme";
import { RouterProvider } from "react-router";
import { router } from "./router";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
