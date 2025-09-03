import { memo, useState } from "react";
import { type Bookmark } from "../../types";
import BookmarkListItem from "../BookmarkListItem";
import { BookmarkDeletionModal } from "./BookmarkDeletionModal";
import { BookmarkEditModal } from "./BookmarkEditModal";
import { BookmarkOptionsMenu } from "./BookmarkOptionsMenu";

type BookmarkListItemProps = {
    bookmark: Bookmark;
    includeBorder?: boolean;
    showFullDetail?: boolean;
    ref: (element: HTMLElement | null) => void;
    dataIndex: number;
};

export const EditableBookmarkListItem = memo(function EditableBookmarkListItem({
    bookmark,
    includeBorder,
    showFullDetail = false,
    ref,
    dataIndex,
}: BookmarkListItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <>
            <BookmarkListItem
                ref={ref}
                dataIndex={dataIndex}
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
