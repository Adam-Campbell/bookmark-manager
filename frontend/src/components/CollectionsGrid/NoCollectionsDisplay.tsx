import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useModal } from "../../ModalContext";

export function NoCollectionsDisplay() {
    const { openModal } = useModal();

    function handleButtonClick() {
        openModal("addCollection");
    }

    return (
        <Container disableGutters maxWidth="sm" sx={{ py: 4 }}>
            <Card variant="outlined">
                <CardContent
                    sx={{
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        No Collections Found
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Collections allow you to organise your bookmarks into
                        distinct lists. Create one to get started!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<AddIcon />}
                        onClick={handleButtonClick}
                    >
                        Create Collection
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
}
