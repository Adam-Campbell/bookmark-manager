import { Chip } from "@mui/material";

export default function BookmarkCountChip({ count }: { count: number }) {
    let bookmarkCountText = "";
    if (count === 0) {
        bookmarkCountText = "No bookmarks";
    } else if (count === 1) {
        bookmarkCountText = "1 bookmark";
    } else {
        bookmarkCountText = count + " bookmarks";
    }

    return <Chip label={bookmarkCountText} />;
}
