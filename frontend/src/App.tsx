import { CssBaseline, ThemeProvider } from "@mui/material";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/work-sans";
import theme from "./theme";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./http";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
