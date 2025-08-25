import { Card, CardContent, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useModal } from "../../ModalContext";

export function CreateCollectionCard() {
    const { openModal } = useModal();

    function handleButtonClick() {
        openModal("addCollection");
    }

    return (
        <Card
            variant="outlined"
            sx={{
                display: "flex",
                flexGrow: 1,
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                }}
            >
                <Typography
                    sx={{
                        mb: 2,
                        textAlign: "center",
                    }}
                    variant="subtitle1"
                    component="h3"
                >
                    Still haven't found what you're looking for?
                </Typography>
                <Button
                    color="primary"
                    aria-label="add collection"
                    size="medium"
                    variant="contained"
                    endIcon={<AddIcon />}
                    onClick={handleButtonClick}
                >
                    Create Collection
                </Button>
            </CardContent>
        </Card>
    );
}
