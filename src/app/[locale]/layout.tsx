import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {hasLocale} from 'next-intl';
import {ReactNode} from "react";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {setRequestLocale} from "next-intl/server";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}

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
        <div className="min-h-screen flex flex-col">
            <Navbar/>
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <Footer/>
        </div>
    );
}
