import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,
} from "@mui/material";

type SelectableBookmarkListItemProps = {
    title: string;
    description: string;
    ref: any;
    dataIndex: number;
    isSelected: boolean;
    handleClick: () => void;
};

export function SelectableBookmarkListItem({
    title,
    description,
    ref,
    dataIndex,
    isSelected,
    handleClick,
}: SelectableBookmarkListItemProps) {
    return (
        <ListItem disablePadding ref={ref} data-index={dataIndex}>
            <ListItemButton disableRipple onClick={handleClick}>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={isSelected}
                        tabIndex={-1}
                        disableRipple
                    />
                </ListItemIcon>
                <ListItemText primary={title} secondary={description} />
            </ListItemButton>
        </ListItem>
    );
}
