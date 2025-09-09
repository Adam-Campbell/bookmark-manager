import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { tagsQuery, transformTagsToTagRepresentations } from "../http";
import { type TagRepresentation } from "../types";

export type TagsAutocompleteProps = {
    chosenTags: TagRepresentation[];
    handleTagsChange: React.Dispatch<React.SetStateAction<TagRepresentation[]>>;
    label?: string;
    placeholder?: string;
};

export default function TagsAutocomplete({
    chosenTags,
    handleTagsChange,
    label = "Add Tags",
    placeholder = "Add Tags",
}: TagsAutocompleteProps) {
    const { data: tagsData, isPending } = useQuery(
        tagsQuery({
            shouldShowSnackbar: true,
            select: transformTagsToTagRepresentations,
        })
    );

    return (
        <Autocomplete
            multiple
            freeSolo
            forcePopupIcon
            filterOptions={(options, state) => {
                const filtered = options.filter((opt) =>
                    opt.name
                        .toLowerCase()
                        .includes(state.inputValue.toLowerCase())
                );
                if (state.inputValue !== "" && filtered.length === 0) {
                    filtered.push({
                        name: state.inputValue,
                        id: null,
                    });
                }
                return filtered;
            }}
            loading={isPending}
            options={tagsData ?? []}
            getOptionLabel={(option) => {
                return typeof option === "string" ? option : option.name;
            }}
            value={chosenTags}
            sx={{ mb: 2 }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="filled"
                    label={label}
                    placeholder={placeholder}
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
                const formatted: TagRepresentation[] = value
                    .map((entry) => {
                        return typeof entry === "string"
                            ? { name: entry, id: null }
                            : entry;
                    })
                    .filter(Boolean);
                handleTagsChange(formatted);
            }}
        />
    );
}
