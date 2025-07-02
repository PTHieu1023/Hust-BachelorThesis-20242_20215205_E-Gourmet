/* eslint-disable @typescript-eslint/no-explicit-any */
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Image from "next/image";
import {Star} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {getTranslations} from "next-intl/server";
import {getCurrentUserInfo} from "@/services/auth.service";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getRecommendations} from "@/services/dish.service";

export const RecommendItemCard = ({rec}: { rec: any }) => {
    return (
        <Card key={rec.id} className="border-gray-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <Image
                            src={rec.image ?? "/logo.svg"}
                            alt={rec.title}
                            className="w-16 h-16 rounded-lg object-cover"
                            width={32} height={32}
                        />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>


                        <div className="flex items-center space-x-4 mb-3">
                            <span className="text-sm font-medium">{rec.restaurant}</span>
                            <Badge variant="outline">{rec.price}</Badge>
                            <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                                <span className="text-sm">{rec.rating}</span>
                            </div>
                        </div>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            Explore
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

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
                            {profile.favCuisines?.length && profile.favCuisines?.length  - 1 > 0 && `...+${profile.favCuisines?.length - 1} more`}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t("avg-rating")}:</span>
                        <span className="font-medium flex items-center gap-2">
                            <span>{profile.averageRating}</span>
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

export const RecommendationList = async () => {
    const recommendations = await getRecommendations();
    return recommendations.map((rec: any) => <RecommendItemCard rec={rec} key={rec.id}/>)
}