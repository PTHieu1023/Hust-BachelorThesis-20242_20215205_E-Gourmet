import {ReactNode} from "react";
import RootProviders from "@/app/[locale]/providers";
import {NextIntlClientProvider} from "next-intl";
import {Inter} from "next/font/google";
import type {Metadata} from "next";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "E-Gourmet - Food Reviews & Recommendations",
    description: "Discover and review amazing food with personalized recommendations",
};

export default async function RootLayout({children}: { children: ReactNode; }) {
    return (
        <html suppressHydrationWarning>
            <body className={inter.className}>
                <RootProviders>
                    <NextIntlClientProvider>
                        {children}
                    </NextIntlClientProvider>
                </RootProviders>
            </body>
        </html>
    );
}