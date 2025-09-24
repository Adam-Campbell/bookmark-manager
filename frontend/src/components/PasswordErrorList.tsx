import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

const passwordRules = [
    {
        label: "At least 8 characters",
        test: (val: string) => val.trim().length >= 8,
    },
    {
        label: "Contains an uppercase letter",
        test: (val: string) => /[A-Z]/.test(val),
    },
    {
        label: "Contains a number",
        test: (val: string) => /[0-9]/.test(val),
    },
    {
        label: "Contains a special character",
        test: (val: string) => /[^A-Za-z0-9]/.test(val),
    },
];

export default function PasswordErrorList({ password }: { password: string }) {
    return (
        <List>
            {passwordRules.map((rule) => {
                const hasPassed = rule.test(password);
                return (
                    <ListItem
                        dense
                        key={rule.label}
                        sx={{
                            color: (theme) =>
                                hasPassed
                                    ? theme.palette.success.dark
                                    : theme.palette.text.secondary,
                        }}
                    >
                        <ListItemIcon sx={{ color: "inherit" }}>
                            {hasPassed ? <CheckIcon /> : <CloseIcon />}
                        </ListItemIcon>
                        <ListItemText primary={rule.label} />
                    </ListItem>
                );
            })}
        </List>
    );
}
