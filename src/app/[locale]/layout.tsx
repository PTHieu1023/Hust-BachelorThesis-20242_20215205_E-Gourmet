import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {ReactNode} from "react";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {setRequestLocale} from "next-intl/server";
import {Source_Sans_3} from "next/font/google";
import type {Metadata} from "next";
import RootProviders from "@/app/[locale]/providers";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import {Toaster} from "@/components/ui/sonner";

const sourceSans3 = Source_Sans_3({
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-source-sans-3",
    preload: true,
    fallback: ["system-ui", "sans-serif"],
    subsets: ["latin", "latin-ext", "vietnamese"]
});

export const metadata: Metadata = {
    title: "E-Gourmet - Food Reviews & Recommendations",
    description: "Discover and review amazing foods with personalized recommendations",
};

export default async function LocaleLayout({children, params}:
                                           {
                                               children: ReactNode;
                                               params: Promise<{ locale: string }>;
                                           }) {
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
       return  notFound();
    }

    setRequestLocale(locale);

    return (
        <html lang={locale} suppressHydrationWarning>
        <body className={`${sourceSans3.className} antialiased`}>
        <RootProviders>
            <NextIntlClientProvider>
                <Header/>
                <main className="flex-grow mx-auto px-4 py-8 min-h-screen bg-background bg-gradient-to-br from-orange-50 via-white to-green-50">
                    {children}
                </main>
                <Toaster />
                <Footer/>
            </NextIntlClientProvider>
        </RootProviders>
        </body>
        </html>
    );
}
