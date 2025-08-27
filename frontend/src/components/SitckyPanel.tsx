import { useState } from "react";
import { Paper, Box, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function StickyPanel({
    isOpenLabel,
    isClosedLabel,
    children,
}: {
    isOpenLabel: string;
    isClosedLabel: string;
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Paper
            sx={{
                p: 2,
                mb: 4,
                position: "sticky",
                top: 80,
                zIndex: 1000,
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="flex-end">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    disableRipple
                    endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                    {isOpen ? isOpenLabel : isClosedLabel}
                </Button>
            </Box>
            <Box sx={{ display: isOpen ? "block" : "none" }}>{children}</Box>
        </Paper>
    );
}
