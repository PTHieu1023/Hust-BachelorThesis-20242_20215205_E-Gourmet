import { refreshToken } from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";
import {Account, getServerSession, NextAuthOptions, TokenSet} from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export interface KCTokenSet extends TokenSet {
    error?: string | number
    expires_in?: number
}


const validateToken = async (token: KCTokenSet) => {
    try {
        const nowTimeStamp = Math.floor(Date.now() / 1000);
        // If token is not expired then return
        if (token.expires_at && nowTimeStamp < token.expires_at) {
            return token;
        }
        const newToken: KCTokenSet = await refreshToken(token.refresh_token || '');
        return {
            ...token,
            access_token: newToken.access_token,
            id_token: newToken.id_token,
            expires_at: Math.floor(Date.now() / 1000) + (newToken.expires_in || 0),
            refresh_token: newToken.refresh_token,
        };
    } catch (error) {
        console.error(error);
        return {
            ...token,
            error: "Failed to validate token",
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [Keycloak({
        issuer: `${process.env.OAUTH_ISSUER}`,
        clientId: `${process.env.OAUTH_CLIENT_ID}`,
        clientSecret: `${process.env.OAUTH_CLIENT_SECRET}`,
    })],
    secret: `${process.env.NEXTAUTH_SECRET}`,
    callbacks: {
        jwt: async ({ token, account }: { token: TokenSet, account: Account | undefined | null }) => {
            if (account) {
                token.access_token = account.access_token;
                token.id_token = account.id_token;
                token.expires_at = account.expires_at;
                token.refresh_token = account.refresh_token;
            }
            return await validateToken(token);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session: ({ session, token }: { session: any, token: any }) => {
            if (token?.error) {
                session.error = token.error
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const tokenDecoded: any  = jwtDecode(`${token?.access_token}`);
                session.access_token = token.access_token;
                session.id_token = token.id_token;
                session.user = {
                    name: `${tokenDecoded.name}`,
                    username: tokenDecoded.preferred_username,
                    email: tokenDecoded.email,
                    imageUrl: tokenDecoded.image_url,
                    realmRoles: tokenDecoded.realm_access.roles,
                    locale: tokenDecoded?.locale || 'en'
                }
            }
            return session;
        }
    }
}

export const getAuthSession = async () => await getServerSession(authOptions);
