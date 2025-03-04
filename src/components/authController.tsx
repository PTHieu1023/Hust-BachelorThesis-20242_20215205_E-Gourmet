'use client'
// import {getAuthSession} from "@/configs/auth.configs";
import useAuth from "@/hooks/useAuth";

export default function AuthController() {
    const { user, status, login, logout } = useAuth();

    if (status === 'loading')
        return (<p>Loading...</p>)
    if (status === 'unauthenticated')
        return (
            <div>
                You are not logged in.
                <button onClick={login}>Login</button>
            </div>
        )

    return (
        <div>
            Hello: {user?.name}
            <button onClick={logout}>Logout</button>
        </div>
    )
}