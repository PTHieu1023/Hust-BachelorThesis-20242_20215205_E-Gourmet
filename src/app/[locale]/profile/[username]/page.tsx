import {Card, CardContent} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Star, Heart} from "lucide-react";
import {FollowingItemCard, UserProfileCard} from "@/components/pages/user-profile";
import {getCurrentReview} from "@/services/review.service";
import {Suspense} from "react";
import {getFollowingRestaurants} from "@/services/restaurant.service";
import {getTranslations, setRequestLocale} from "next-intl/server";

export default async function Profile({params}: { params: Promise<{ username: string, locale: string }> }) {
    const {username, locale} = await params;
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

const CurrentReviewTab = async ({t}: any) => {
    const recentReviews = await getCurrentReview();

    if (recentReviews.length === 0) {
        return <div className="text-center py-8 text-gray-500">{t('no_reviews')}</div>;
    }

    return (
        <div className="grid gap-6">
            {recentReviews.map((review) => (
                <Card key={review.id} className="border-gray-100">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">{review.restaurant}</h3>
                                <p className="text-sm text-gray-600">{review.dish}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/>
                                <span>{review.rating}</span>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-4">{review.review}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{review.date}</span>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    <Heart className="w-4 h-4"/>
                                    <span>{review.likes}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const FollowingTab = async ({t}: any) => {
    const followingRestaurants = await getFollowingRestaurants();

    if (followingRestaurants.length === 0) {
        return <div className="text-center py-8 text-gray-500">{t('no_following')}</div>;
    }

    return (
        <div className="grid gap-6">
            {followingRestaurants.map((restaurant) => (
                <FollowingItemCard key={restaurant.id} item={restaurant} />
            ))}
        </div>
    );
};
