import { Container, Paper, Box, Button } from "@mui/material";
import { useState } from "react";
import { authClient } from "../../authClient";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { EmailInlineEditRow } from "./EmailInlineEditRow";
import { NameInlineEditRow } from "./NameInlineEditRow";

export default function AccountSettingsPanel() {
    const { isPending } = authClient.useSession();

    const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);
    const [deleteAccountModalIsOpen, setDeleteAccountModalIsOpen] =
        useState(false);

    if (isPending) {
        return null;
    }
    return (
        <Container maxWidth="lg" sx={{ py: 0 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
                <EmailInlineEditRow />
                <NameInlineEditRow pushDown />
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
                        onClick={() => setPasswordModalIsOpen(true)}
                    >
                        Change Password
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => setDeleteAccountModalIsOpen(true)}
                    >
                        Delete Account
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
        </Container>
    );
}
