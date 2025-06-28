import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Heart, TrendingUp, Users} from "lucide-react";
import {getRecommendations, getTrendingNearYou} from "@/services/dish.service";
import {getTranslations} from "next-intl/server";
import {Suspense} from "react";
import {RecommendItemCard, TrendingNearYouCard, UserStatsCard} from "@/components/pages/foryou";

export default async function ForYouPage() {
    const t = await getTranslations("for-you");
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
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

                <div className="space-y-6">
                    <Card className="border-gray-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2 text-lg">
                                <TrendingUp className="w-5 h-5 text-orange-500"/>
                                <span>{t("trending-near-you")}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Suspense fallback={"loading recommendations..."}>
                                <TrendingNearYouList/>
                            </Suspense>
                        </CardContent>
                    </Card>
                    <UserStatsCard/>
                </div>
            </div>
        </div>
    );
};

const RecommendationList = async () => {
    const recommendations = await getRecommendations();
    return recommendations.map((rec: any, index) => <RecommendItemCard rec={rec} key={`cc${index}`}/>)
}

const TrendingNearYouList = async () => {
    const trendingNearYou = await getTrendingNearYou();
    return trendingNearYou.map((item, index) => <TrendingNearYouCard item={item} key={`cc2${index}`}/>)
}