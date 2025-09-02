import BookmarkListItem from "./BookmarkListItem";
import { type Bookmark } from "../types";
import { IconButton } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

type RemovableBookmarkListItemProps = {
    bookmark: Bookmark;
    includeBorder?: boolean;
    handleRemoveClick: () => void;
};

export default function RemovableBookmarkListItem({
    bookmark,
    includeBorder,
    handleRemoveClick,
}: RemovableBookmarkListItemProps) {
    return (
        <BookmarkListItem
            bookmark={bookmark}
            includeBorder={includeBorder}
            showFullDetail={true}
            controls={
                <IconButton onClick={handleRemoveClick}>
                    <RemoveCircleIcon />
                </IconButton>
            }
        />
    );
}
