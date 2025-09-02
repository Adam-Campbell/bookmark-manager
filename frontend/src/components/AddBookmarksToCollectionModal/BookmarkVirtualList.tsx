import { List, Box } from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { type Bookmark } from "../../types";
import { SelectableBookmarkListItem } from "./SelectableBookmarkListItem";

type BookmarkVirtualListProps = {
    bookmarksToDisplay: Bookmark[];
    selectedBookmarks: number[];
    onToggleBookmark: (id: number) => void;
};

export function BookmarkVirtualList({
    bookmarksToDisplay,
    selectedBookmarks,
    onToggleBookmark,
}: BookmarkVirtualListProps) {
    const containerRef = useRef(null);

    const virtualizer = useVirtualizer({
        count: bookmarksToDisplay.length,
        getScrollElement: () => containerRef.current,
        estimateSize: () => 120,
        overscan: 10,
    });

    const items = virtualizer.getVirtualItems();

    return (
        <Box
            sx={{
                overflowY: "auto",
                flexGrow: 1,
                minHeight: "150px",
            }}
            ref={containerRef}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: `${virtualizer.getTotalSize()}px`,
                }}
            >
                <List
                    disablePadding
                    sx={{
                        width: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        willChange: "transform",
                    }}
                    style={{
                        transform: `translateY(${items[0]?.start ?? 0}px)`,
                    }}
                >
                    {items.map((virtualItem) => {
                        const bookmark = bookmarksToDisplay[virtualItem.index];
                        if (!bookmark) return null;
                        return (
                            <SelectableBookmarkListItem
                                key={virtualItem.key}
                                ref={virtualizer.measureElement}
                                dataIndex={virtualItem.index}
                                title={bookmark.title}
                                description={bookmark.description}
                                isSelected={selectedBookmarks.includes(
                                    bookmark.id
                                )}
                                handleClick={() =>
                                    onToggleBookmark(bookmark.id)
                                }
                            />
                        );
                    })}
                </List>
            </div>
        </Box>
    );
}
