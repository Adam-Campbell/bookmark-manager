import { useParams, type LoaderFunctionArgs } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@mui/material";
import { type CollectionWithBookmarks } from "../types";
import { queryClient } from "../http";
import CollectionHeader from "../components/CollectionHeader";

export default function CollectionPage() {
    const params = useParams();

    const id = Number(params.id);

    const { data } = useQuery({
        queryKey: ["collections", { id }],
        staleTime: 5 * 60 * 1000, // 5 minutes
        queryFn: async ({ signal }) => {
            console.log("Fetching collection from hook");
            const response = await fetch(`/api/collections/${id}`, {
                credentials: "include",
                signal,
            });
            if (!response.ok) {
                throw new Error("Failed to fetch collection");
            }
            const collection: CollectionWithBookmarks = await response.json();
            return collection;
        },
    });

    console.log(data);

    if (!data) {
        return null;
    }

    return (
        <Container sx={{ py: 6 }}>
            <CollectionHeader
                title={data.title}
                description={data.description}
                id={data.id}
                bookmarkCount={data.bookmarks.length}
            />
        </Container>
    );
}

export const collectionLoader = async ({ params }: LoaderFunctionArgs) => {
    const { id } = params;
    await queryClient.ensureQueryData({
        queryKey: ["collections", { id: Number(id) }],
        queryFn: async () => {
            console.log("Fetching collection from page loader");
            const response = await fetch(`/api/collections/${id}`, {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch collection");
            }
            const collection: CollectionWithBookmarks = await response.json();
            return collection;
        },
    });
};
