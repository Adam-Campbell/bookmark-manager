import { useRouteError, isRouteErrorResponse } from "react-router";

function getMessage(status: number): string {
    const statusMessageMap: Record<number, string> = {
        401: "You must sign in before continuing",
        403: "You are not permitted to access this resource",
        404: "The requested resource could not be found",
    };

    return statusMessageMap[status] ?? "Fallback goes here";
}

export default function ErrorPage() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <>
                <h1>{error.status}</h1>
                <p>{getMessage(error.status)}</p>
            </>
        );
    } else {
        return (
            <>
                <h1>An unexpected error has occurred</h1>
                <p>DON'T PANIC DON'T PANIC</p>
            </>
        );
    }
}
