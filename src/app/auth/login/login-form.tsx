'use client'
import { useActionState } from "react"
import { login, type LoginState } from "@/lib/actions/auth"

const initialState: LoginState = {}

export function LoginForm() {
    const [state, action, pending] = useActionState(login, initialState)

    return (
        <form action={action} className="flex flex-col">
            <label htmlFor="login">Login</label>
            <input name="login" required/>
            <label htmlFor="password">Password</label>
            <input name="password" type="password" required/>
            {state.error && <p role="alert">{state.error}</p>}
            <button disabled={pending}>Se connecter</button>
        </form>
    )
}