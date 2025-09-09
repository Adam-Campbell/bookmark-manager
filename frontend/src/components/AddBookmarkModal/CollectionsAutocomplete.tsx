import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
    collectionsQuery,
    transformCollectionsToCollectionRepresentations,
} from "../../http";
import { type CollectionRepresentation } from "../../types";

export type CollectionsAutocompleteProps = {
    chosenCollections: CollectionRepresentation[];
    handleCollectionsChange: React.Dispatch<
        React.SetStateAction<CollectionRepresentation[]>
    >;
};

export const CollectionsAutocomplete = ({
    chosenCollections,
    handleCollectionsChange,
}: CollectionsAutocompleteProps) => {
    const {
        data: collectionsData,
        isPending,
        error,
    } = useQuery(
        collectionsQuery({
            shouldShowSnackbar: true,
            select: transformCollectionsToCollectionRepresentations,
        })
    );

    if (error) {
        console.log("error is: ", error);
    }

    return (
        <>
            <Autocomplete
                multiple
                options={collectionsData ?? []}
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
            {error && (
                <p style={{ color: "red" }}>
                    An error occurred when retrieving collections.
                </p>
            )}
        </>
    );
};
