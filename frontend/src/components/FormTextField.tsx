import { TextField } from "@mui/material";
import { type AnyFieldApi } from "@tanstack/react-form";
import { fieldHasErrors, getFieldErrors } from "../utils";

type FormTextFieldProps = {
    field: AnyFieldApi;
    label: string;
    type?: string;
    shouldAutoFocus?: boolean;
    isTextArea?: boolean;
};

export default function FormTextField({
    field,
    label,
    type = "text",
    shouldAutoFocus,
    isTextArea,
}: FormTextFieldProps) {
    return (
        <TextField
            margin="dense"
            variant="filled"
            type={type}
            fullWidth
            name={field.name}
            label={label}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            error={fieldHasErrors(field)}
            helperText={getFieldErrors(field)}
            autoFocus={shouldAutoFocus}
            multiline={isTextArea}
            rows={isTextArea ? 4 : 1}
        />
    );
}
