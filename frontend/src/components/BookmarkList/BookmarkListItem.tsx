import { memo, useState } from "react";
import { Box, ListItem, Typography, Link } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { type Bookmark } from "../../types";
import { BookmarkOptionsMenu } from "./BookmarkOptionsMenu";
import { BookmarkTags } from "./BookmarkTags";
import { BookmarkDeletionModal } from "./BookmarkDeletionModal";
import { BookmarkEditModal } from "./BookmarkEditModal";

type BookmarkListItemProps = {
    bookmark: Bookmark;
    includeBorder?: boolean;
    showFullDetail?: boolean;
};

export const BookmarkListItem = memo(function BookmarkListItem({
    bookmark,
    includeBorder,
    showFullDetail = false,
}: BookmarkListItemProps) {
    const { title, url, description, tags } = bookmark;
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <>
            <ListItem
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

                    <BookmarkOptionsMenu
                        bookmarkId={bookmark.id}
                        beginDeletion={() => setIsDeleting(true)}
                        beginEditing={() => setIsEditing(true)}
                    />
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
                        <BookmarkTags tags={tags} />
                    </>
                )}
            </ListItem>
            <BookmarkDeletionModal
                bookmarkId={bookmark.id}
                isOpen={isDeleting}
                onClose={() => setIsDeleting(false)}
            />
            <BookmarkEditModal
                bookmark={bookmark}
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
            />
        </>
    );
});
