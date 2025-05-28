import { signIn, signOut, useSession } from "next-auth/react";
import {clearSession, syncUser} from "@/services/auth.service";
import {useEffect} from "react";

// Login action from client side to log in keycloak server
const login = () => { signIn("keycloak").then(); }

export default function useAuth() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, status }: { data: any, status: any} = useSession();
    const user = data && data.user;

    useEffect(() => {
        if(status === 'authenticated' && data?.user)
            syncUser(data.user).then()
    }, [status]);

    // Logout action in client side to clear session data
    const logout = async () => {
        clearSession(data?.id_token).finally(signOut);
    }

    return { user, status, login, logout }
}
