import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type UniqueIdentifier,
    type DragStartEvent,
    type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { Paper, List } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "../../http";
import { showSuccessSnackbar, showErrorSnackbar } from "../../snackbarStore";
import { type BookmarkWithIndex } from "../../types";
import RemovableBookmarkListItem from "./RemovableBookmarkListItem";

type CollectionBookmarkListProps = {
    id: number;
    bookmarks: BookmarkWithIndex[];
};

/*

In theory, we should be able to use the Tanstack Query cache as the source of truth for 
the DnD list, as long as we optimistically update it when making mutations. In practice,
however, it seems to behave unreliably, causing the list items to shift around on drag end.

So instead, we maintain local state, named localBookmarks, which serves as the source of
truth for the DnD list. In the onError handler of the useMutation hook, we reset localBookmarks
back to the current value of the bookmarks prop, which will be the latest value of this collections
bookmarks from the queryClient. 

We also update localBookmarks whenever the bookmarks prop changes, so that if the queryClient
receives new data whilst this component is mounted, then localBookmarks stays in sync with the
latest queryClient data.

*/

export default function CollectionBookmarkList({
    id,
    bookmarks,
}: CollectionBookmarkListProps) {
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [localBookmarks, setLocalBookmarks] =
        useState<BookmarkWithIndex[]>(bookmarks);

    const [prevBookmarks, setPrevBookmarks] =
        useState<BookmarkWithIndex[]>(bookmarks);

    // The bookmarks prop comes from the queryClient, so if that data changes whilst
    // this component is mounted then we want to update localBookmarks to reflect the
    // latest value.
    if (bookmarks !== prevBookmarks) {
        setPrevBookmarks(bookmarks);
        setLocalBookmarks(bookmarks);
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const { mutate: reorderBookmarksMutation } = useMutation({
        mutationFn: async ({
            collectionId,
            currentIndex,
            newIndex,
        }: {
            collectionId: number;
            currentIndex: number;
            newIndex: number;
        }) => {
            const response = await fetch(
                `/api/collections/${collectionId}/bookmarks/`,
                {
                    credentials: "include",
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ currentIndex, newIndex }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to update bookmarks");
            }
        },
        onSuccess: () => {
            showSuccessSnackbar("Bookmarks updated");
            queryClient.invalidateQueries({
                queryKey: ["collections", { id }],
            });
        },
        onError: () => {
            setLocalBookmarks(bookmarks);
            showErrorSnackbar("Failed to update bookmarks");
        },
    });

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        setActiveId(active.id);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over !== null && active.id !== over.id) {
            const currentIndex = localBookmarks.findIndex(
                (bookmark) => bookmark.id === active.id
            );
            const newIndex = localBookmarks.findIndex(
                (bookmark) => bookmark.id === over.id
            );
            if (currentIndex !== -1 && newIndex !== -1) {
                setLocalBookmarks((prev) =>
                    arrayMove(prev, currentIndex, newIndex)
                );
                reorderBookmarksMutation({
                    collectionId: id,
                    currentIndex,
                    newIndex,
                });
            }
        }
    }

    return (
        <Paper variant="outlined">
            <List>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={localBookmarks}
                        strategy={verticalListSortingStrategy}
                    >
                        {localBookmarks.map((bookmark, index) => (
                            <RemovableBookmarkListItem
                                key={bookmark.id}
                                bookmark={bookmark}
                                includeBorder={index !== 0}
                                collectionId={id}
                                isDragging={activeId === bookmark.id}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </List>
        </Paper>
    );
}
