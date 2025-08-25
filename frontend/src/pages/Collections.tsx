import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../http";
import { Container, Typography } from "@mui/material";
import { type CollectionWithBookmarkCount } from "../types";
import CollectionsGrid from "../components/CollectionsGrid";

export default function CollectionsPage() {
    const { data, error, isPending, isError } = useQuery({
        staleTime: 5 * 60 * 1000, // 5 minutes
        queryKey: ["collections"],
        queryFn: async () => {
            console.log("collections page fetched data");
            const response = await fetch("/api/collections", {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch collections");
            }
            const collections: CollectionWithBookmarkCount[] =
                await response.json();
            return collections;
        },
    });

    const collections = data || [];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Collections
            </Typography>
            <CollectionsGrid collections={collections} />
        </Container>
    );
}

export const collectionsLoader = async () => {
    await queryClient.ensureQueryData({
        queryKey: ["collections"],
        queryFn: async () => {
            console.log("collections loader fetched data");
            const response = await fetch("/api/collections", {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch collections");
            }
            const collections: CollectionWithBookmarkCount[] =
                await response.json();
            return collections;
        },
    });
};
