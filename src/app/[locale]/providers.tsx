"use client"

import { ReactNode } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"

export default function RootProviders({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <SessionProvider>
                <NextThemesProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                    themes={["light", "dark"]}
                >
                    {children}
                </ NextThemesProvider >
            </SessionProvider>
        </>
    )
}