import { Suspense } from "react"
import { LoginForm } from "../../../components/auth/login-form";

export default function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ logout?: string }>
}) {
    return (
        <main>
            <h1>Connexion</h1>
            <Suspense fallback={null}>
                <LogoutNotice searchParams={searchParams} />
            </Suspense>
            <LoginForm/>
        </main>
    )
}

async function LogoutNotice({
    searchParams,
}: {
    searchParams: Promise<{ logout?: string }>
}) {
    const { logout } = await searchParams
    if (logout !== "local") return null

    return (
        <p role="status">
            Votre session locale a été fermée, mais le service n’a pas confirmé la révocation du jeton.
        </p>
    )
}