import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useMatch } from "react-router";
import { NavLink as RouterLink } from "react-router";

export function DrawerNavLink({
    to,
    label,
    icon,
}: {
    to: string;
    label: string;
    icon: React.ReactNode;
}) {
    const match = useMatch(to);
    return (
        <ListItemButton
            component={RouterLink}
            to={to}
            sx={{
                bgcolor: match ? "grey.200" : "transparent",
            }}
        >
            <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
            <ListItemText primary={label} />
        </ListItemButton>
    );
}
