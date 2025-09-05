import { authClient } from "../../authClient";
import { InlineEditRow } from "./InlineEditRow";

export function NameInlineEditRow({ pushDown }: { pushDown?: boolean }) {
    const { data, isPending, refetch } = authClient.useSession();

    if (isPending) {
        return;
    }

    async function handleUpdateName(newName: string) {
        await authClient.updateUser({
            name: newName,
            image: null,
        });
        refetch();
    }

    const name = data?.user.name ?? "";

    return (
        <InlineEditRow
            currentValue={name}
            label="Update username"
            title="Name"
            id="username"
            onConfirm={handleUpdateName}
            pushDown={pushDown}
        />
    );
}
