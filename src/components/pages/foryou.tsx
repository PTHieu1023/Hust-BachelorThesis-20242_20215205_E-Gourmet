import {Card, CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";
import {MapPin, Star, Users} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {getTranslations} from "next-intl/server";

export const RecommendItemCard = ({rec}: { rec: any }) => {
    return (
        <Card key={rec.id} className="border-gray-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        {rec.type === "reviewer" ? (
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={rec.reviewer?.avatar}
                                             alt={rec.reviewer?.name}/>
                                <AvatarFallback>SC</AvatarFallback>
                            </Avatar>
                        ) : (
                            <Image
                                src={`${rec.image}`}
                                alt={rec.title}
                                className="w-16 h-16 rounded-lg object-cover"
                                width={32} height={32}
                            />
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>

                        {rec.type === "restaurant" && (
                            <div className="flex items-center space-x-4 mb-3">
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                                    <span className="text-sm">{rec.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4 text-gray-400"/>
                                    <span
                                        className="text-sm text-gray-600">{rec.distance}</span>
                                </div>
                            </div>
                        )}

                        {rec.type === "dish" && (
                            <div className="flex items-center space-x-4 mb-3">
                                <span className="text-sm font-medium">{rec.restaurant}</span>
                                <Badge variant="outline">{rec.price}</Badge>
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                                    <span className="text-sm">{rec.rating}</span>
                                </div>
                            </div>
                        )}

                        {rec.type === "reviewer" && (
                            <div className="flex items-center space-x-4 mb-3">
                                                        <span
                                                            className="text-sm text-gray-600">{rec.reviewer?.reviews} reviews</span>
                                <Badge className="bg-green-100 text-green-700">
                                    {rec.reviewer?.similarity}
                                </Badge>
                            </div>
                        )}

                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            {rec.type === "reviewer" ? "Follow" : "Explore"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export const TrendingNearYouCard = ({item}: { item: any }) => {
    return(
        <div key={item.id} className="flex items-center space-x-3 group cursor-pointer">
            <Image
                src={item.image}
                alt={item.name}
                width={64}
                height={64}
                className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
            />
            <div className="flex-1">
                <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                    {item.name}
                </h4>
                <p className="text-sm text-gray-600">{item.restaurant}</p>
                <p className="text-xs text-green-600 font-medium">{item.trending}</p>
            </div>
        </div>
    )
}

export const UserStatsCard = async () => {
    const t =await getTranslations("for-you.statistics");
    const profile = {
        favoriteCuisine: "Italian",
        averageRating: 4.2,
        totalReviews: 89
    }

    return (
        <Card className="border-gray-100 bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-6 text-center space-y-4">
                <div
                    className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-white"/>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t("title")}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>{t("fav-cuisine")}:</span>
                            <span className="font-medium">{profile.favoriteCuisine}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t("avg-rating")}:</span>
                            <span className="font-medium">{profile.averageRating}★</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t("total-review")}:</span>
                            <span className="font-medium">{profile.totalReviews}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}