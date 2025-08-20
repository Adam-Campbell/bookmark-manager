import { useMatch } from "react-router";
import { Link } from "@mui/material";
import { NavLink as RouterLink } from "react-router";

export function NavLink({
    to,
    children,
    ...props
}: {
    to: string;
    children: React.ReactNode;
}) {
    const match = useMatch(to);
    return (
        <Link
            component={RouterLink}
            to={to}
            {...props}
            sx={{
                color: "primary.contrastText",
                textDecoration: match ? "underline" : "none",
                mr: 2,
                fontWeight: match ? 600 : 400,
            }}
        >
            {children}
        </Link>
    );
}
