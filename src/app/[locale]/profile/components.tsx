/* eslint-disable @typescript-eslint/no-explicit-any */
import {getCurrentUserInfo} from "@/services/auth.service";
import {getCuisines} from "@/services/cuisine.service";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import EditProfileModal from "@/components/EditProfileModal";
import {MapPin, Star} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Link} from "@/i18n/navigation";
import {Button} from "@/components/ui/button";
import {getReviews, Review} from "@/services/review.service";
import {getFollowingRestaurants} from "@/services/restaurant.service";
import {RatingStar} from "@/components/ui/rating-star";

export const CurrentReviewTab = async ({t}: any) => {
    const recentReviews = await getReviews();

    if (recentReviews.length === 0) {
        return <div className="text-center py-8 text-gray-500">{t('no_reviews')}</div>;
    }

    return (
        <div className="grid gap-6">
            {recentReviews.map((review) => <ReviewCard key={review.id} review={review}/>)}
        </div>
    );
};

export const FollowingTab = async ({t}: any) => {
    const followingRestaurants = await getFollowingRestaurants();

    if (followingRestaurants.length === 0) {
        return <div className="text-center py-8 text-gray-500">{t('no_following')}</div>;
    }

    return (
        <div className="grid gap-6">
            {followingRestaurants.map((restaurant) => (
                <FollowingItemCard key={restaurant.id} item={restaurant}/>
            ))}
        </div>
    );
};


export const UserProfileCard = async () => {
    const [profile, cuisines] = await Promise.all([getCurrentUserInfo(), getCuisines()])
    return (
        <Card className="border-gray-100 mb-6">
            <CardContent className="p-8">
                <div
                    className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
                    <div className="flex flex-col space-y-4 items-center justify-center mb-4">
                        <Avatar className="w-32 h-32">
                            <AvatarImage src={profile.avatarUrl} alt={profile.username}/>
                            <AvatarFallback>{profile.username}</AvatarFallback>
                        </Avatar>
                        <EditProfileModal
                            userProfile={profile}
                            cuisines={cuisines}
                        />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.displayName}</h1>

                        <div className="space-y-2 mb-4">
                            {profile.favCuisines && profile.favCuisines.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Loves:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {profile.favCuisines.map((pref) => (
                                            <Badge key={pref.id} variant="outline" className="text-xs">
                                                {pref.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-4 max-w-md">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{profile.reviewCount}</div>
                                <div className="text-sm text-gray-600">Reviews</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{profile.averageRating}</div>
                                <div className="text-sm text-gray-600">Average rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const FollowingItemCard = ({item}: { item: any }) => {
    return (
        <Card key={item.id} className="border-gray-100">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={item.avatar} alt={item.name}/>
                        <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.bio}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3"/>
                                <span>{item.location}</span>
                            </div>
                            <span>•</span>
                            <span>{item.cuisine}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/>
                                <span>{item.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{item.followers} followers</span>
                            <span>•</span>
                            <span>Posted {item.lastPost}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link href={`/restaurant/${item.id}`}>
                            <Button variant="outline" size="sm">
                                View Restaurant
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const ReviewCard = ({review}: { review: Review }) => {
    return (<Card key={review.id} className="border-gray-100">
            <CardContent className="p-6">
                <div>
                    <h3 className="font-semibold text-gray-900">{review.dish.restaurant.name}</h3>
                    <p className="text-sm text-gray-600">{review.dish.name}</p>
                </div>
                <RatingStar rating={review.rating} />

                <p className="text-gray-700 mb-4">{review.review}</p>
                <span>{review.createdAt.toLocaleDateString()}</span>
            </CardContent>
        </Card>
    )
}