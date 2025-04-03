import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {ReactNode} from "react";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {setRequestLocale} from "next-intl/server";
import {Inter} from "next/font/google";
import type {Metadata} from "next";
import RootProviders from "@/app/[locale]/providers";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "E-Gourmet - Food Reviews & Recommendations",
    description: "Discover and review amazing food with personalized recommendations",
};

export default async function LocaleLayout({children, params}:
                                           {
                                               children: ReactNode;
                                               params: Promise<{ locale: string }>;
                                           }) {
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    setRequestLocale(locale);
    return (
        <html lang={locale} suppressHydrationWarning>
        <body className={inter.className}>
            <RootProviders>
            <NextIntlClientProvider>
                <div className="min-h-screen flex flex-col">
                    <Navbar/>
                    <main className="flex-grow container mx-auto px-4 py-8">
                        {children}
                    </main>
                    <Footer/>
                </div>
            </NextIntlClientProvider>
            </RootProviders>
        </body>
        </html>
    );
}
