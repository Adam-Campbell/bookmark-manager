import {
    Card,
    CardActions,
    CardContent,
    Typography,
    Button,
    Chip,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import { type CollectionWithBookmarkCount } from "../../types";
import { countFormatter } from "../../utils";

export function CollectionCard({
    collection,
}: {
    collection: CollectionWithBookmarkCount;
}) {
    let bookmarkCountText = countFormatter(
        collection.bookmarkCount,
        "bookmark"
    );

    return (
        <Card
            variant="outlined"
            sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
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
