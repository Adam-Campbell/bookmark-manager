import AddIcon from "@mui/icons-material/Add";
import { Box, Paper, List, Typography, Button } from "@mui/material";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { useModal } from "../../ModalContext";
import { type Bookmark } from "../../types";
import { EditableBookmarkListItem } from "./EditableBookmarkListItem";

type BookmarkListProps = {
    bookmarksToDisplay: Bookmark[];
    showFullDetail: boolean;
    userHasBookmarks: boolean;
};

export default function BookmarkList({
    bookmarksToDisplay,
    showFullDetail,
    userHasBookmarks,
}: BookmarkListProps) {
    const { openModal } = useModal();
    const containerRef = useRef<HTMLDivElement>(null);

    const virtualizer = useWindowVirtualizer({
        count: bookmarksToDisplay.length,
        estimateSize: () => 190,
        overscan: 5,
        scrollMargin: containerRef.current?.offsetTop ?? 0,
    });

    function handleCreateBookmarkClick() {
        openModal("addBookmark");
    }

    const items = virtualizer.getVirtualItems();
    const listTranslate =
        (items[0]?.start ?? 0) - virtualizer.options.scrollMargin;

    if (!userHasBookmarks) {
        return (
            <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="subtitle1" component="p" sx={{ mb: 2 }}>
                    It looks like you haven't created any bookmarks yet.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<AddIcon />}
                    onClick={handleCreateBookmarkClick}
                >
                    Create Bookmark
                </Button>
            </Paper>
        );
    }

    if (bookmarksToDisplay.length === 0) {
        return (
            <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="subtitle1" component="p">
                    No matching bookmarks
                </Typography>
                <Typography variant="body1" component="p">
                    Try adjusting your search query or tag filters.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper ref={containerRef} variant="outlined">
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                }}
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                }}
            >
                <List
                    disablePadding
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        willChange: "transform",
                    }}
                    style={{
                        transform: `translateY(${listTranslate}px)`,
                    }}
                >
                    {items.map((virtualItem) => {
                        const bookmark = bookmarksToDisplay[virtualItem.index];
                        if (!bookmark) return null;
                        return (
                            <EditableBookmarkListItem
                                key={virtualItem.key}
                                bookmark={bookmark}
                                showFullDetail={showFullDetail}
                                includeBorder={virtualItem.index !== 0}
                                ref={virtualizer.measureElement}
                                dataIndex={virtualItem.index}
                            />
                        );
                    })}
                </List>
            </Box>
        </Paper>
    );
}
