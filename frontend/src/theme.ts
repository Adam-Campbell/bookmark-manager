import {
    createTheme,
    type TypographyVariantsOptions,
    type PaletteOptions,
} from "@mui/material";

const typographyOptions: TypographyVariantsOptions = {
    fontFamily: ['"Work Sans Variable"', "sans-serif"].join(","),
    h1: {
        fontFamily: '"Montserrat Variable"',
        fontWeight: 900,
        fontSize: "6rem",
    },
    h2: {
        fontFamily: '"Montserrat Variable"',
        fontWeight: 900,
        fontSize: "3.75rem",
    },
    h3: {
        fontFamily: '"Montserrat Variable"',
        fontWeight: 900,
        fontSize: "3rem",
    },
    h4: {
        fontFamily: '"Montserrat Variable"',
        fontWeight: 700,
        fontSize: "2.125rem",
    },
    h5: {
        fontFamily: '"Montserrat Variable"',
        fontWeight: 700,
        fontSize: "1.5rem",
    },
    h6: {
        fontFamily: '"Montserrat Variable"',
        fontWeight: 700,
        fontSize: "1.25rem",
    },
    subtitle1: {
        fontFamily: '"Work Sans Variable"',
        fontWeight: 600,
        fontSize: "1rem",
    },
    subtitle2: {
        fontFamily: '"Work Sans Variable"',
        fontWeight: 600,
        fontSize: "0.875rem",
    },
    body1: {
        fontFamily: '"Work Sans Variable"',
        fontWeight: 400,
        fontSize: "1rem",
    },
    body2: {
        fontFamily: '"Work Sans Variable"',
        fontWeight: 400,
        fontSize: "0.875rem",
    },
    button: {
        fontFamily: '"Work Sans Variable"',
        fontWeight: 600,
        fontSize: "0.875rem",
        textTransform: "none",
    },
};

const primary = "#0f7ea3";
const secondary = "#B34419";
const error = "#d90429";
const success = "#06d6a0";
const darkText = "#1c1b19";
const lightText = "#ffffff";

const lightPalette: PaletteOptions = {
    primary: {
        main: primary,
        contrastText: lightText,
    },
    secondary: {
        main: secondary,
        contrastText: darkText,
    },
    error: {
        main: error,
    },
    success: {
        main: success,
    },
    background: {
        default: "#f9f6f2",
        paper: "#fcfbf9",
    },
    text: {
        primary: darkText,
        secondary: "rgba(28,27,25,0.7)",
        disabled: "rgba(28,27,25,0.5)",
    },
};

const darkModePrimary = "#1487AD";
const darkModeSecondary = "#B57D16";
const darkModeSuccess = success;
const darkModeError = "#FD4E51";
const darkModeLightText = lightText;
const darkModeDarkText = darkText;

const darkPalette: PaletteOptions = {
    primary: {
        main: darkModePrimary,
        contrastText: darkModeLightText,
    },
    secondary: {
        main: darkModeSecondary,
        contrastText: darkModeDarkText,
    },
    error: {
        main: darkModeError,
        contrastText: darkModeDarkText,
    },
    success: {
        main: darkModeSuccess,
    },
    background: {
        default: "#10100E",
        paper: "#161513",
    },
    text: {
        primary: darkModeLightText,
        secondary: "rgba(255,255,255,0.9)",
        disabled: "rgba(255,255,255,0.5)",
    },
};

type BreakpointValues = {
    xs: number;
    sm: number;
    tablet: number;
    md: number;
    lg: number;
    xl: number;
};

const theme = createTheme({
    typography: typographyOptions,
    colorSchemes: {
        light: {
            palette: lightPalette,
        },
        dark: {
            palette: darkPalette,
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            tablet: 768,
            md: 900,
            lg: 1200,
            xl: 1536,
        } as BreakpointValues,
    },
    shape: {
        borderRadius: 3,
    },
});

export default theme;
