import { Box } from "@mui/material";
import AccountSettingsPanel from "../components/AccountSettingsPanel";
import { queryClient } from "../http";
import { type Tag } from "../types";

export default function UserSettingsPage() {
    return (
        <Box sx={{ pt: 6, pb: 12 }}>
            <AccountSettingsPanel />
        </Box>
    );
}

export const userSettingsLoader = async () => {
    await queryClient.ensureQueryData({
        queryKey: ["tags"],
        queryFn: async () => {
            const response = await fetch("/api/tags", {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch tags");
            }
            const tags: Tag[] = await response.json();
            return tags;
        },
    });
};
