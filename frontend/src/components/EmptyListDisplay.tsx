import { Paper, Typography, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type EmptyListDisplayBaseProps = {
    message: string;
    extraInfo?: string;
    displayInline?: boolean;
};

type WithoutButton = {
    creationAction?: undefined;
    creationMessage?: undefined;
};

type WithButton = {
    creationAction: () => void;
    creationMessage: string;
};

type EmptyListDisplayProps = EmptyListDisplayBaseProps &
    (WithoutButton | WithButton);

export default function EmptyListDisplay({
    message,
    extraInfo,
    displayInline,
    creationAction,
    creationMessage,
}: EmptyListDisplayProps) {
    const Wrapper: React.ElementType = displayInline ? Box : Paper;
    return (
        <Wrapper
            sx={{ p: 4, textAlign: "center" }}
            {...(Wrapper === Paper ? { variant: "outlined" } : {})}
        >
            <Typography variant="subtitle1" component="h1" sx={{ mb: 1 }}>
                {message}
            </Typography>
            {extraInfo && <Typography variant="body2">{extraInfo}</Typography>}
            {creationAction && creationMessage && (
                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    endIcon={<AddIcon />}
                    onClick={creationAction}
                >
                    {creationMessage}
                </Button>
            )}
        </Wrapper>
    );
}
