/* eslint-disable @typescript-eslint/no-explicit-any */
import {Restaurant} from "@/services/restaurant.service";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Clock, Globe, Heart, MapPin, Phone, Star} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {RatingStar} from "@/components/ui/rating-star";
import {getDish} from "@/services/dish.service";
import {getReviews} from "@/services/review.service";
import {fetchPosts} from "@/services/post.service";
import PostCard from "@/components/PostCard";
import {Link} from "@/i18n/navigation";

export const RestaurantInfo = ({t, restaurant}: { t: (key: string) => string, restaurant: Restaurant }) => {
    return (
        <Card className="border-gray-100 mb-6">
            <CardContent className="p-0">
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6">
                    <Image
                        src={restaurant.coverImage ?? "/logo.svg"}
                        alt={restaurant.name}
                        width={1980}
                        height={720}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-6 left-6 text-white">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
                        <Button className="bg-orange-500 hover:bg-orange-600">
                            <Heart className="w-4 h-4 mr-2"/>
                            {t('details.follow')}
                        </Button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <RatingStar rating={restaurant.averageRating}/>
                            <span className="text-sm text-gray-600">
                                {restaurant.averageRating.toFixed(1)} ({restaurant.reviewCount} {t('common.reviews')})
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{restaurant.followerCount} {t('common.followers')}</span>
                            <span>{restaurant.postCount} {t('common.posts')}</span>
                        </div>
                    </div>

                    <p className="text-gray-700 mb-4">{restaurant.description}</p>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500"/>
                            <span>{restaurant.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500"/>
                            <span>{restaurant.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500"/>
                            <span>{restaurant.openHour}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-500"/>
                            <span>{restaurant.website}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const MenuHighlights = async ({t, restaurantId}: { t: (key: string) => string, restaurantId: number }) => {
    const highlights = await getDish({restaurantId: restaurantId});

    return (
        <Card className="border-gray-100">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">{t('menu.highlights')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {highlights.map((dish) => (
                        <Link href={`/restaurant/${restaurantId}/${dish.id}`} key={dish.id} className="group cursor-pointer">
                            <div className="aspect-square relative mb-3 rounded-lg overflow-hidden">
                                <Image
                                    src={dish.images ?? '/logo.svg'}
                                    alt={dish.name}
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                            </div>
                            <h3 className="font-medium mb-1">{dish.name}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-orange-600 font-semibold">${dish.price}</span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400"/>
                                    <span className="text-sm text-gray-600">{dish.rating}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export const RecentReviews = async ({t, restaurantId}: { t: (key: string) => string, restaurantId: number }) => {
    const reviews = await getReviews({restaurantId: restaurantId, size: 99999});

    return (
        <Card className="border-gray-100">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">{t('reviews.recent')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex items-start gap-4">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={review.userAvatarUrl ?? "/logo.svg"}/>
                                    <AvatarFallback>{review.userDisplayName}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="font-medium">{review.dishName}</h4>
                                            <div className="flex items-center gap-1">
                                                <RatingStar rating={review.rating}/>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export const PostTab = async ({t, restaurantId}: { t: (key: string) => string, restaurantId: number }) => {
    const posts = await fetchPosts({restaurantId: restaurantId});
    if (!posts || posts.length === 0) {
        return (
            <Card className="border-gray-100">
                <CardContent className="p-12 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📱</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('posts.coming-soon-title')}</h3>
                    <p className="text-gray-600">{t('posts.coming-soon-desc')}</p>
                </CardContent>
            </Card>
        );
    }
    return (
        <Card className="border-gray-100">
            <CardHeader>
                <h3 className={"text-2xl font-bold text-gray-700"}>Restaurant Posts</h3>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {posts.map((post: any) => (
                        <PostCard key={post.id} post={post}/>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
};