import {
    Card,
    CardActions,
    CardContent,
    Typography,
    Button,
    Chip,
} from "@mui/material";
import { type CollectionWithBookmarkCount } from "../types";
import { Link as RouterLink } from "react-router";

export default function CollectionCard({
    collection,
}: {
    collection: CollectionWithBookmarkCount;
}) {
    let bookmarkCountText = "";
    if (collection.bookmarkCount === 0) {
        bookmarkCountText = "No bookmarks";
    } else if (collection.bookmarkCount === 1) {
        bookmarkCountText = "1 bookmark";
    } else {
        bookmarkCountText = collection.bookmarkCount + " bookmarks";
    }

    return (
        <Card
            variant="outlined"
            sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
            <CardContent>
                <Typography gutterBottom variant="h5">
                    {collection.title}
                </Typography>
                <Typography variant="body1">
                    {collection.description}
                </Typography>
                <Chip label={bookmarkCountText} size="small" />
            </CardContent>
            <CardActions sx={{ px: 2 }}>
                <Button
                    component={RouterLink}
                    to={`/collections/${collection.id}`}
                    size="small"
                >
                    View Collection
                </Button>
            </CardActions>
        </Card>
    );
}
