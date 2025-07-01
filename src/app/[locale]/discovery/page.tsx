import {Suspense} from "react";
import {DiscoveryFilter, FoodCard} from "@/app/[locale]/discovery/components";
import {getDish} from "@/services/dish.service";
import {getTranslations, setRequestLocale} from "next-intl/server";

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

const ItemList = async (
    {searchParams, t}: { searchParams: Promise<Record<string, string | string[] | number | number[]>>, t: any }) => {
    const {search = "", cuisineId = 0, minPrice = 0, maxPrice = 9999999} =await searchParams;
    const dishes = await getDish({search, cuisineId, minPrice, maxPrice});
    if (dishes.length === 0) {
        return <div>{t('no-results')}</div>;
    }
    return dishes.map(dish => <FoodCard dish={dish} key={dish.id}/>)
}