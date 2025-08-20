import { useQuery } from "@tanstack/react-query";

export default function BookmarksPage() {
    const { data, error, isPending, isError } = useQuery({
        queryKey: ["bookmarks"],
        queryFn: async () => {
            const response = await fetch("/api/bookmarks", {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch bookmarks");
            }
            return response.json();
        },
    });

    console.log(data);

    return <p>Placeholder</p>;
}
