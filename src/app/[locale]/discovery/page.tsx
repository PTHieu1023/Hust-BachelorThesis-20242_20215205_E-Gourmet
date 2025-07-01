import {Suspense} from "react";
import {DiscoveryFilter} from "@/app/[locale]/discovery/components";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {ItemList} from "@/app/[locale]/discovery/server-components";

interface PageProps {
    searchParams: Promise<Record<string, string | string[] | number | number[]>>;
    params: Promise<{ locale: "en" | "vi" }>;
}

export default async function DiscoveryPage({searchParams, params}: Readonly<PageProps>) {
    const t = await getTranslations("discovery");
    const {locale} = await params;
    setRequestLocale(locale);
    return (
        <div className="container mx-auto px-4 py-6">
            <DiscoveryFilter/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Suspense fallback={<div>{t('loading')}</div>}>
                    <ItemList searchParams={searchParams} t={t}/>
                </Suspense>
            </div>
        </div>
    );
};

