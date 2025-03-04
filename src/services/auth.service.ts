"use server"

// Refresh token when access token is expired
export const refreshToken = async (refreshToken: string) => {
    try {
        const res = await fetch(`${process.env.OAUTH_TOKEN_URL}`, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: `${process.env.OAUTH_CLIENT_ID}`,
                client_secret: `${process.env.OAUTH_CLIENT_SECRET}`,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
            method: "POST",
        })

        if (!res.ok) throw new Error("Failed to refresh token");

        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error("Failed to refresh token");
    }
}

// Clear session in keycloak server via API
export const clearSession = async (idToken: string) => {
    if (!idToken) return { error: "Invalid token" };
    const url = `${process.env.OAUTH_LOGOUT_URL}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL || '')}`;
    fetch(url).finally(() => ({ message: "Session revoked" }));
}