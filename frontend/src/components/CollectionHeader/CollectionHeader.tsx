import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Paper, Box, Typography, Button, Chip } from "@mui/material";
import { useState } from "react";
import { countFormatter } from "../../utils";
import { CollectionDeletionModal } from "./CollectionDeletionModal";
import { CollectionEditModal } from "./CollectionEditModal";

type CollectionHeaderProps = {
    title: string;
    description: string;
    id: number;
    bookmarkCount: number;
};

export default function CollectionHeader({
    title,
    description,
    id,
    bookmarkCount,
}: CollectionHeaderProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    let bookmarkCountText = countFormatter(bookmarkCount, "bookmark");

    return (
        <Paper variant="outlined" sx={{ padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {description}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: {
                        xs: "flex-start",
                        sm: "space-between",
                    },
                    marginTop: 2,
                }}
            >
                <Chip label={bookmarkCountText} size="small" />
                <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<DeleteIcon />}
                    sx={{
                        mt: { xs: 1, sm: 0 },
                        ml: { xs: 0, sm: "auto" },
                        width: { xs: "100%", sm: "initial" },
                    }}
                    onClick={() => setIsDeleteModalOpen(true)}
                >
                    Delete
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<EditIcon />}
                    sx={{
                        mt: { xs: 1, sm: 0 },
                        ml: { xs: 0, sm: 2 },
                        width: { xs: "100%", sm: "initial" },
                    }}
                    onClick={() => setIsEditModalOpen(true)}
                >
                    Edit Details
                </Button>
                <CollectionEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title={title}
                    description={description}
                    id={id}
                />
                <CollectionDeletionModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    id={id}
                />
            </Box>
        </Paper>
    );
}
