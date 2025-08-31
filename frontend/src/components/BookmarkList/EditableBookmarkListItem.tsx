import { memo, useState } from "react";
import { type Bookmark } from "../../types";
import { BookmarkOptionsMenu } from "./BookmarkOptionsMenu";
import { BookmarkDeletionModal } from "./BookmarkDeletionModal";
import { BookmarkEditModal } from "./BookmarkEditModal";
import BookmarkListItem from "../BookmarkListItem";

type BookmarkListItemProps = {
    bookmark: Bookmark;
    includeBorder?: boolean;
    showFullDetail?: boolean;
};

export const EditableBookmarkListItem = memo(function EditableBookmarkListItem({
    bookmark,
    includeBorder,
    showFullDetail = false,
}: BookmarkListItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <>
            <BookmarkListItem
                bookmark={bookmark}
                includeBorder={includeBorder}
                showFullDetail={showFullDetail}
                controls={
                    <BookmarkOptionsMenu
                        bookmarkId={bookmark.id}
                        beginDeletion={() => setIsDeleting(true)}
                        beginEditing={() => setIsEditing(true)}
                    />
                }
            />
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
