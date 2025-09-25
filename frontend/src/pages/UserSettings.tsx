import { Box, Container } from "@mui/material";
import AccountSettingsPanel from "../components/AccountSettingsPanel";
import TagManager from "../components/TagManager";
import { tagsQuery, queryClient } from "../http";

export default function UserSettingsPage() {
    return (
        <Box
            sx={{
                pt: 4,
                pb: { xs: 10, tablet: 4 },
            }}
        >
            <Container maxWidth="lg">
                <AccountSettingsPanel />
                <TagManager />
            </Container>
        </Box>
    );
}

export const userSettingsLoader = async () => {
    await queryClient.ensureQueryData(tagsQuery());
};
