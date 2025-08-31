import { useParams, type LoaderFunctionArgs } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
    Container,
    ListItem,
    Box,
    Typography,
    Link,
    List,
    Paper,
    IconButton,
} from "@mui/material";
import { type CollectionWithBookmarks, type Bookmark } from "../types";
import { queryClient } from "../http";
import CollectionHeader from "../components/CollectionHeader";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import BookmarkListItem from "../components/BookmarkListItem";

type RemovableBookmarkListItemProps = {
    bookmark: Bookmark;
    includeBorder?: boolean;
};

function RemovableBookmarkListItem({
    bookmark,
    includeBorder,
}: RemovableBookmarkListItemProps) {
    return (
        <BookmarkListItem
            bookmark={bookmark}
            includeBorder={includeBorder}
            showFullDetail={true}
            controls={
                <IconButton>
                    <RemoveCircleIcon />
                </IconButton>
            }
        />
    );
}

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
            <Paper variant="outlined" sx={{ mt: 3 }}>
                <List>
                    {data.bookmarks.map((bookmark, index) => (
                        <RemovableBookmarkListItem
                            key={bookmark.id}
                            bookmark={bookmark}
                            includeBorder={index !== 0}
                        />
                    ))}
                </List>
            </Paper>
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
