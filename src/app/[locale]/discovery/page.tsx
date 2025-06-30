import {Suspense} from "react";
import {DiscoveryFilter, FoodCard} from "@/components/pages/discovery";
import {getDish} from "@/services/dish.service";
import {getTranslations, setRequestLocale} from "next-intl/server";

export default async function DiscoveryPage({searchParams, params}: { searchParams: Promise<Record<string, any>>, params: Promise<{locale: string}> }) {
    const t = await getTranslations("discovery");
    const {locale} = await params;
    setRequestLocale(locale);
    return (
        <div className="container mx-auto px-4 py-6">
            <DiscoveryFilter/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Suspense fallback={<div>{t('loading')}</div>}>
                    <ItemList searchParams={await searchParams} t={t}/>
                </Suspense>
            </div>
        </div>
    );
};

const ItemList = async ({searchParams, t}: { searchParams: Record<string, any>, t: any }) => {
    const {search = "", cuisineId = 0, minPrice = 0, maxPrice = 9999999} = searchParams;
    const dishes = await getDish({search, cuisineId, minPrice, maxPrice});
    if (dishes.length === 0) {
        return <div>{t('no-results')}</div>;
    }
    return dishes.map(dish => <FoodCard dish={dish} key={dish.id}/>)
}