import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Heart} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Suspense} from "react";
import {RecommendationList, UserStatsCard} from "@/app/[locale]/for-you/components";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function ForYouPage({params}: Readonly<PageProps>) {
    const {locale} = await params;
    setRequestLocale(locale)
    const t = await getTranslations("for-you");

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-gray-100">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Heart className="w-5 h-5 text-red-500"/>
                                <span>{t("title")}</span>
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <div className="space-y-4">
                        <Suspense fallback={"loading recommendations..."}>
                            <RecommendationList/>
                        </Suspense>
                    </div>
                </div>
                <UserStatsCard/>
            </div>
        </div>
    );
};

