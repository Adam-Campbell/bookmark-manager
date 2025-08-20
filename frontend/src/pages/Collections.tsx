import { useQuery } from "@tanstack/react-query";

export default function CollectionsPage() {
    const { data, error, isPending, isError } = useQuery({
        queryKey: ["collections"],
        queryFn: async () => {
            const response = await fetch("/api/collections", {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch collections");
            }
            return response.json();
        },
    });

    console.log(data);

    return <h1>This is the collections page</h1>;
}
