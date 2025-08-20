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
const secondary = "#d9596a";
const triadic1 = "#b8d367";
const triadic2 = "#57324e";
const darkText = "#1c1b19";
const lightText = "#ffffff";

const paletteOptions: PaletteOptions = {
    mode: "light",
    primary: {
        main: primary,
        contrastText: lightText,
    },
    secondary: {
        main: secondary,
        contrastText: darkText,
    },
    error: {
        main: "#d90429",
    },
    warning: {
        main: "#ffd166",
    },
    info: {
        main: "#3a0ca3",
    },
    success: {
        main: "#06d6a0",
    },
    background: {
        default: "#f9f6f2",
        paper: "#fcfbf9",
    },
    text: {
        primary: "#1c1b19",
        secondary: "rgba(28,27,25,0.8)",
        disabled: "rgba(28,27,25,0.5)",
    },
};

const theme = createTheme({
    typography: typographyOptions,
    palette: paletteOptions,
    shape: {
        borderRadius: 3,
    },
});

export default theme;
