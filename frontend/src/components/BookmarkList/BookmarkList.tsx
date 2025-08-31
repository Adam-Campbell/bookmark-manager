import { Paper, List, Typography, Button } from "@mui/material";
import { EditableBookmarkListItem } from "./EditableBookmarkListItem";
import { type Bookmark } from "../../types";
import AddIcon from "@mui/icons-material/Add";
import { useModal } from "../../ModalContext";

type BookmarkListProps = {
    bookmarksToDisplay: Bookmark[];
    showFullDetail: boolean;
    userHasBookmarks: boolean;
};

// If !userHasBookmarks, display no created bookmarks message.
// Else if bookmarksToDisplay.length === 0, display no bookmarks match message.
// Else display bookmarksToDisplay

export default function BookmarkList({
    bookmarksToDisplay,
    showFullDetail,
    userHasBookmarks,
}: BookmarkListProps) {
    const { openModal } = useModal();

    function handleCreateBookmarkClick() {
        openModal("addBookmark");
    }

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
        <Paper variant="outlined">
            <List>
                {bookmarksToDisplay.map((bookmark, index) => (
                    <EditableBookmarkListItem
                        key={bookmark.id}
                        bookmark={bookmark}
                        showFullDetail={showFullDetail}
                        includeBorder={index !== 0}
                    />
                ))}
            </List>
        </Paper>
    );
}
