import {Suspense} from "react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Home} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import CommonBreadcrumb, {BreadcrumbItemProps} from "@/components/layout/CommonBreadcrumb";
import {
    MenuHighlights,
    PostTab,
    RecentReviews,
    RestaurantInfo
} from "@/app/[locale]/restaurant/[restaurantId]/components";
import Loading from "@/components/loading";
import {getRestaurants} from "@/services/restaurant.service";

export default async function RestaurantProfilePage({params}: Readonly<{
    params: Promise<{ locale: string, restaurantId: number }>
}>) {
    const {locale, restaurantId} = await params;
    setRequestLocale(locale)
    const t = await getTranslations("restaurant");
    const restaurant = (await getRestaurants({restaurantId: restaurantId}))?.[0];
    const breadcrumbItems: BreadcrumbItemProps[] = [
        {
            label: <Home className={"size-3"}/>,
            href: `/`,
            isCurrent: false
        },
        {
            label: restaurant.name,
            href: `/restaurant/${restaurantId}`,
            isCurrent: true
        }
    ]

    return (
        <div className="container mx-auto px-4 py-6">
            <CommonBreadcrumb items={breadcrumbItems}/>
            <RestaurantInfo t={t} restaurant={restaurant}/>
            <Tabs defaultValue="menu" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
                    <TabsTrigger value="menu">{t('tabs.menu')}</TabsTrigger>
                    <TabsTrigger value="posts">{t('tabs.posts')}</TabsTrigger>
                    <TabsTrigger value="reviews">{t('tabs.reviews')}</TabsTrigger>
                </TabsList>
                <TabsContent value="menu" className="space-y-6">
                    <Suspense fallback={<Loading/>}>
                        <MenuHighlights t={t} restaurantId={restaurantId}/>
                    </Suspense>
                </TabsContent>
                <TabsContent value="posts" className="space-y-6">
                    <Suspense fallback={<Loading/>}>
                        <PostTab t={t} restaurantId={restaurantId}/>
                    </Suspense>
                </TabsContent>
                <TabsContent value="reviews" className="space-y-6">
                    <Suspense fallback={<Loading/>}>
                        <RecentReviews t={t} restaurantId={restaurantId}/>
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
};

