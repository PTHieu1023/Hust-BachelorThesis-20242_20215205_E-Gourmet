import {Suspense} from "react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Home} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import CommonBreadcrumb, {BreadcrumbItemProps} from "@/components/layout/CommonBreadcrumb";
import {MenuTab, PostTab, RestaurantInfo, ReviewTab} from "@/app/[locale]/restaurant/[username]/components";

export default async function RestaurantProfilePage({params}: Readonly<{ params: Promise<{ locale: string, username: string }> }>) {
    const {locale, username} = await params;
    setRequestLocale(locale)
    const t = await getTranslations("restaurant");
    const breadcrumbItems:BreadcrumbItemProps[] = [
        {
            label: <Home className={"size-3"}/>,
            href: `/`,
            isCurrent: false
        },
        {
            label: username,
            href: `/restaurant/${username}`,
            isCurrent: true
        }
    ]

    return (
        <div className="container mx-auto px-4 py-6">
            <CommonBreadcrumb items={breadcrumbItems}/>
            <Suspense fallback={<div className="text-center py-4">{t('details.loading', {default: 'Loading...'})}</div>}>
                <RestaurantInfo t={t}/>
            </Suspense>
            <Tabs defaultValue="menu" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
                    <TabsTrigger value="menu">{t('tabs.menu')}</TabsTrigger>
                    <TabsTrigger value="posts">{t('tabs.posts')}</TabsTrigger>
                    <TabsTrigger value="reviews">{t('tabs.reviews')}</TabsTrigger>
                </TabsList>
                <TabsContent value="menu" className="space-y-6">
                    <Suspense fallback={<div className="text-center py-4">{t('details.loading', {default: 'Loading...'})}</div>}>
                        <MenuTab t={t}/>
                    </Suspense>
                </TabsContent>
                <TabsContent value="posts" className="space-y-6">
                    <Suspense fallback={<div className="text-center py-4">{t('details.loading', {default: 'Loading...'})}</div>}>
                        <PostTab t={t}/>
                    </Suspense>
                </TabsContent>
                <TabsContent value="reviews" className="space-y-6">
                    <Suspense fallback={<div className="text-center py-4">{t('details.loading', {default: 'Loading...'})}</div>}>
                        <ReviewTab t={t}/>
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
};

