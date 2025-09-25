import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    useColorScheme,
} from "@mui/material";

export function ThemeSelector() {
    const { mode, setMode } = useColorScheme();

    return (
        <FormControl sx={{ mt: 3 }}>
            <FormLabel
                id="theme-toggle-label"
                sx={(theme) => ({
                    ...theme.typography.subtitle1,
                    color: theme.palette.text.primary,
                    "&.Mui-focused": {
                        color: theme.palette.text.primary,
                    },
                })}
            >
                Theme
            </FormLabel>
            <RadioGroup
                aria-labelledby="theme-toggle-label"
                name="theme-toggle"
                row
                value={mode}
                onChange={(e) =>
                    setMode(e.target.value as "system" | "light" | "dark")
                }
            >
                <FormControlLabel
                    value="system"
                    control={<Radio />}
                    label="System"
                />
                <FormControlLabel
                    value="light"
                    control={<Radio />}
                    label="Light"
                />
                <FormControlLabel
                    value="dark"
                    control={<Radio />}
                    label="Dark"
                />
            </RadioGroup>
        </FormControl>
    );
}
