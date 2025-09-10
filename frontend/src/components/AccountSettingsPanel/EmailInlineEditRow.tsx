import { authClient } from "../../authClient";
import { InlineEditRow } from "./InlineEditRow";
import { showSuccessSnackbar } from "../../snackbarStore";

export function EmailInlineEditRow({ pushDown }: { pushDown?: boolean }) {
    const { data, isPending, refetch } = authClient.useSession();

    if (isPending) {
        return;
    }

    async function handleUpdateEmail(newEmail: string) {
        await authClient.changeEmail({
            newEmail,
        });
        refetch();
        showSuccessSnackbar("Email updated");
    }

    const email = data?.user.email ?? "";

    return (
        <InlineEditRow
            currentValue={email}
            label="Update email"
            title="Email"
            id="email"
            onConfirm={handleUpdateEmail}
            pushDown={pushDown}
        />
    );
}
