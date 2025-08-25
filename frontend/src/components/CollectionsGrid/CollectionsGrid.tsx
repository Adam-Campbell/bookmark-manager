import { Grid } from "@mui/material";
import { CollectionCard } from "./CollectionCard";
import { type CollectionWithBookmarkCount } from "../../types";
import { CreateCollectionCard } from "./CreateCollectionCard";
import { NoCollectionsDisplay } from "./NoCollectionsDisplay";

export default function CollectionsGrid({
    collections,
}: {
    collections: CollectionWithBookmarkCount[];
}) {
    if (collections.length === 0) {
        return <NoCollectionsDisplay />;
    }

    return (
        <Grid container spacing={2}>
            {collections.map((collection) => (
                <Grid
                    display="flex"
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                    key={collection.id}
                >
                    <CollectionCard collection={collection} />
                </Grid>
            ))}
            <Grid display="flex" size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CreateCollectionCard />
            </Grid>
        </Grid>
    );
}
