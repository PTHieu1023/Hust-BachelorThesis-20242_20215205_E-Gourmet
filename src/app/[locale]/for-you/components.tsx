/* eslint-disable @typescript-eslint/no-explicit-any */
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Image from "next/image";
import {Star} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {getTranslations} from "next-intl/server";
import {getCurrentUserInfo} from "@/services/auth.service";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getRecommendations, Recommendation} from "@/services/dish.service";
import {Link} from "@/i18n/navigation";
import {getAuthSession} from "@/configs/auth.config";

export const UserStatsCard = async () => {
    const t = await getTranslations("for-you.statistics");
    const profile = await getCurrentUserInfo();

    return (
        <Card className="border-gray-100 bg-gradient-to-br from-orange-50 to-red-50 h-fit hidden md:block">
            <CardHeader className={"flex items-center space-x-4 justify-center"}>
                <h3 className="font-semibold text-gray-900 mb-2 text-xl">{t("title")}</h3>
                <Avatar className="size-32">
                    <AvatarImage src={profile.avatarUrl ?? "/logo.svg"} alt={profile.username}/>
                    <AvatarFallback>{profile.displayName}</AvatarFallback>
                </Avatar>
            </CardHeader>
            <CardContent className="p-6 text-center text-sm space-y-4">
                <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                        <span>{t("fav-cuisine")}:</span>
                        <span className="font-medium">
                            {profile.favCuisines?.splice(0, 1).map(cuisine => cuisine.name).join(', ')}
                            {profile.favCuisines?.length && profile.favCuisines?.length - 1 > 0 && `...+${profile.favCuisines?.length - 1} more`}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t("avg-rating")}:</span>
                        <span className="font-medium flex items-center gap-2">
                            <span>{profile.averageRating?.toFixed(1)}</span>
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t("total-review")}:</span>
                        <span className="font-medium">{profile.reviewCount}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


export function RecommendItemCard({rec}: { rec: Recommendation }) {
    return (
        <Link href={`/restaurant/${rec.restaurantId}/${rec.dishId}`} className="block">
            <Card className="border-gray-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <Image
                                src={rec.images?.[0] ?? "/logo.svg"}
                                alt={rec.dishName}
                                className="w-16 h-16 rounded-lg object-cover"
                                width={64} height={64}
                            />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{rec.dishName}</h3>

                            <div className="flex items-center space-x-4 mb-3">
                                <span className="text-sm font-medium">{rec.restaurantName}</span>
                                <Badge variant="outline">{rec.price}</Badge>
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                                    <span className="text-sm">{rec.rating.toFixed(1)}</span>
                                    {rec.reviewCount > 0 && (
                                        <span className="text-xs text-gray-500">({rec.reviewCount})</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export async function RecommendationList() {
    const session = await getAuthSession();
    const userId = session?.user?.id;
    try {
        const recommendations = await getRecommendations(userId ?? "");
        if (!recommendations || !Array.isArray(recommendations)) {
            return <div className="p-4 text-center text-gray-500">No recommendations available at the moment.</div>;
        }
        return (
            <div className="space-y-4">
                {recommendations.map((rec) => (
                    <RecommendItemCard rec={rec} key={rec.dishId}/>
                ))}
            </div>
        );
    } catch (error) {
        return (
            <div className="p-4 text-center text-red-500">
                Failed to load recommendations. Please try again later.
            </div>
        )
    }
}