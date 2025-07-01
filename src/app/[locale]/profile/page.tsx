import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {CurrentReviewTab, FollowingTab, UserProfileCard} from "@/app/[locale]/profile/components";
import {Suspense} from "react";
import {getTranslations, setRequestLocale} from "next-intl/server";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function Profile({params}: Readonly<PageProps>) {
    const {locale} = await params;
    setRequestLocale(locale)
    const t = await getTranslations("profile");
    return (
        <div className="container mx-auto px-4 py-6">
            <UserProfileCard/>
            <Tabs defaultValue="reviews" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[500px]">
                    <TabsTrigger value="reviews">{t('tabs.reviews')}</TabsTrigger>
                    <TabsTrigger value="following">{t('tabs.following')}</TabsTrigger>
                </TabsList>
                <TabsContent value="reviews" className="space-y-6">
                    <Suspense fallback={<div>{t('loading')}</div>}>
                        <CurrentReviewTab t={t}/>
                    </Suspense>
                </TabsContent>
                <TabsContent value="following" className="space-y-6">
                    <Suspense fallback={<div>{t('loading')}</div>}>
                        <FollowingTab t={t}/>
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    )
};