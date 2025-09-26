import { Box, Paper, List } from "@mui/material";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { useModal } from "../../ModalContext";
import { type Bookmark } from "../../types";
import EmptyListDisplay from "../EmptyListDisplay";
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

    // We render this if the user has no bookmarks at all
    if (!userHasBookmarks) {
        return (
            <EmptyListDisplay
                message="It looks like you haven't created any bookmarks yet."
                creationAction={handleCreateBookmarkClick}
                creationMessage="Create Bookmark"
            />
        );
    }

    // We render this if the user has bookmarks, but they are currently all filtered out.
    if (bookmarksToDisplay.length === 0) {
        return (
            <EmptyListDisplay
                message="No matching bookmarks."
                extraInfo="Try adjusting your search query or tag filters."
            />
        );
    }

    // We render this if the user has bookmarks and at least one has satisfied the filters.
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
