import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Paper, Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { authClient } from "../../authClient";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { EmailInlineEditRow } from "./EmailInlineEditRow";
import { NameInlineEditRow } from "./NameInlineEditRow";
import { ThemeSelector } from "./ThemeSelector";

export default function AccountSettingsPanel() {
    const { isPending } = authClient.useSession();

    const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);
    const [deleteAccountModalIsOpen, setDeleteAccountModalIsOpen] =
        useState(false);

    if (isPending) {
        return null;
    }
    return (
        <>
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Account Settings
                </Typography>
                <EmailInlineEditRow />
                <NameInlineEditRow pushDown />
                <ThemeSelector />
                <Box
                    sx={{
                        mt: 4,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        "@media(min-width: 450px)": {
                            flexDirection: "row",
                            justifyContent: "flex-end",
                        },
                    }}
                >
                    <Button
                        variant="contained"
                        color="error"
                        endIcon={<DeleteIcon />}
                        onClick={() => setDeleteAccountModalIsOpen(true)}
                    >
                        Delete Account
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<EditIcon />}
                        onClick={() => setPasswordModalIsOpen(true)}
                    >
                        Change Password
                    </Button>
                </Box>
            </Paper>
            <ChangePasswordModal
                isOpen={passwordModalIsOpen}
                onClose={() => setPasswordModalIsOpen(false)}
            />
            <DeleteAccountModal
                isOpen={deleteAccountModalIsOpen}
                onClose={() => setDeleteAccountModalIsOpen(false)}
            />
        </>
    );
}
