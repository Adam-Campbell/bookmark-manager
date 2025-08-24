import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { type Tag, type TagRepresentation } from "../types";

export type TagsAutocompleteProps = {
    chosenTags: TagRepresentation[];
    handleTagsChange: React.Dispatch<React.SetStateAction<TagRepresentation[]>>;
};

export default function TagsAutocomplete({
    chosenTags,
    handleTagsChange,
}: TagsAutocompleteProps) {
    const { data, isPending } = useQuery({
        queryKey: ["tags"],
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {
            const response = await fetch("/api/tags", {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch tags");
            }
            const tags: Tag[] = await response.json();
            return tags.map((tag) => ({ id: tag.id, name: tag.name }));
        },
    });

    const tagsData = data || [];

    return (
        <Autocomplete
            multiple
            freeSolo
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
            options={tagsData}
            getOptionLabel={(option) => {
                return typeof option === "string" ? option : option.name;
            }}
            value={chosenTags}
            sx={{ mb: 2 }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="filled"
                    label="Add Tags"
                    placeholder="Add Tags"
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
