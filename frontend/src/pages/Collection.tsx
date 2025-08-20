import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

export default function CollectionPage() {
    const { id } = useParams();

    const { data, error, isPending, isError } = useQuery({
        queryKey: ["bookmarks", { id }],
        queryFn: async () => {
            const response = await fetch(`/api/collections/${id}`, {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch collection");
            }
            return response.json();
        },
    });

    console.log(data);

    return <h1>This is the page for a single collection</h1>;
}
