import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { type Collection, type CollectionRepresentation } from "../../types";

export type CollectionsAutocompleteProps = {
    chosenCollections: CollectionRepresentation[];
    handleCollectionsChange: React.Dispatch<
        React.SetStateAction<CollectionRepresentation[]>
    >;
};

function transformCollectionsToRepresentations(
    collections: Collection[]
): CollectionRepresentation[] {
    return collections.map((col) => ({
        id: col.id,
        title: col.title,
    }));
}

export const CollectionsAutocomplete = ({
    chosenCollections,
    handleCollectionsChange,
}: CollectionsAutocompleteProps) => {
    const { data, isPending } = useQuery({
        staleTime: 0 * 60 * 1000,
        select: transformCollectionsToRepresentations,
        queryKey: ["collections"],
        queryFn: async () => {
            const response = await fetch("/api/collections", {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch collections");
            }
            const collections: Collection[] = await response.json();
            return collections;
        },
    });

    const collectionsData = data || [];

    return (
        <Autocomplete
            multiple
            options={collectionsData}
            value={chosenCollections}
            getOptionLabel={(option) => option.title}
            loading={isPending}
            sx={{ mb: 2 }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="filled"
                    label="Add to Collection"
                    placeholder="Add to Collection"
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isPending && (
                                        <CircularProgress
                                            color="inherit"
                                            size={20}
                                        />
                                    )}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        },
                    }}
                />
            )}
            onChange={(_event, value, _reason, _details) => {
                const safeValue = value.filter(Boolean);
                handleCollectionsChange(safeValue);
            }}
        />
    );
};
