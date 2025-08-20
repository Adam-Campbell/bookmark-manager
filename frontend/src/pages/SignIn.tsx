import { useSession } from "../SessionContext";

export default function SignInPage() {
    const { signIn } = useSession();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        if (!email || !password) {
            console.warn("Email and password are required");
            return;
        }
        await signIn(email, password);
    };

    return (
        <form method="post" onSubmit={handleSubmit}>
            <label htmlFor="email">
                Email
                <input type="email" required id="email" name="email" />
            </label>
            <label htmlFor="password">
                Password
                <input type="password" required id="password" name="password" />
            </label>
            <button type="submit">Sign In</button>
        </form>
    );
}
