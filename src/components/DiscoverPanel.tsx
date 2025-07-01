import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {getRecommendations} from "@/services/dish.service";

const DiscoveryPanel = async () => {
    const trendingRestaurants = await getRecommendations();

    return (
        <div className="space-y-6">
            {/* Trending Restaurants */}
            <Card className="border-gray-100">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                        <Star className="w-5 h-5 text-orange-500" />
                        <span>For you</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {trendingRestaurants.map((restaurant) => (
                        <div key={restaurant.id} className="flex items-center space-x-3 group cursor-pointer">
                            <div className="relative">
                                <Image
                                    src={restaurant.image ?? "/logo.svg"}
                                    alt={restaurant.title}
                                    className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                                    width={1920}
                                    height={1920}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                                    {restaurant.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs text-gray-600">{restaurant.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Link href="/for-you">
                        <Button variant="outline" className="w-full mt-4 hover:bg-orange-50 hover:border-orange-200">
                            View more
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default DiscoveryPanel;