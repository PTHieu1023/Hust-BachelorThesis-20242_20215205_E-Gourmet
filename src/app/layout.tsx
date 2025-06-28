import "@/styles/globals.css";
import {ReactNode} from "react";
import {routing} from "@/i18n/routing";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}


export default async function RootLayout({children}: { children: ReactNode; }) {
    return children;
}