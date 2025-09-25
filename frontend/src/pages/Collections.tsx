import { Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import CollectionsGrid from "../components/CollectionsGrid";
import { queryClient, collectionsQuery } from "../http";

export default function CollectionsPage() {
    const { data: collections } = useQuery(
        collectionsQuery({
            shouldShowSnackbar: true,
        })
    );

    return (
        <Container
            maxWidth="lg"
            sx={{
                pt: 4,
                pb: { xs: 10, tablet: 4 },
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Collections
            </Typography>
            <CollectionsGrid collections={collections ?? []} />
        </Container>
    );
}

export const collectionsLoader = async () => {
    await queryClient.ensureQueryData(collectionsQuery());
};
