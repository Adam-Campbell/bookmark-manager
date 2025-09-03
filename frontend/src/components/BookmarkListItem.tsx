import LaunchIcon from "@mui/icons-material/Launch";
import { Box, ListItem, Typography, Link, Chip } from "@mui/material";
import { type Bookmark } from "../types";

type BookmarkListItemProps = {
    bookmark: Bookmark;
    includeBorder?: boolean;
    showFullDetail?: boolean;
    controls?: React.ReactNode;
    ref?: (element: HTMLElement | null) => void;
    dataIndex?: number;
};

export default function BookmarkListItem({
    bookmark,
    includeBorder,
    showFullDetail = false,
    controls,
    ref,
    dataIndex,
}: BookmarkListItemProps) {
    const { title, url, description, tags } = bookmark;

    return (
        <>
            <ListItem
                ref={ref}
                data-index={dataIndex}
                sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "100%",
                    borderTop: (theme) =>
                        includeBorder
                            ? `1px solid ${theme.palette.divider}`
                            : "none",
                }}
            >
                <Box display="flex" alignItems="center" width="100%">
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            flexGrow: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "100%",
                            fontSize: {
                                xs: "1rem",
                                sm: "1.125rem",
                            },
                            fontWeight: "bold",
                        }}
                    >
                        {title}
                    </Typography>

                    {controls && <Box>{controls}</Box>}
                </Box>

                <Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        overflow: "hidden",
                        maxWidth: "100%",
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <LaunchIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Box
                        component="span"
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {url}
                    </Box>
                </Link>
                {showFullDetail && (
                    <>
                        <Typography
                            sx={{ mb: 1 }}
                            variant="body2"
                            color="text.secondary"
                        >
                            {description}
                        </Typography>
                        {tags && (
                            <Box sx={{ ml: -1 }}>
                                {tags.map((tag) => (
                                    <Chip
                                        key={tag.id}
                                        label={`#${tag.name}`}
                                        color="primary"
                                        size="small"
                                        sx={{ ml: 1 }}
                                    />
                                ))}
                            </Box>
                        )}
                    </>
                )}
            </ListItem>
        </>
    );
}
