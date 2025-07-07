import {getCurrentUserInfo} from "@/services/auth.service";
import {getCuisines} from "@/services/cuisine.service";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import EditProfileModal from "@/components/EditProfileModal";
import {CircleDollarSign, MapPin} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Link} from "@/i18n/navigation";
import {Button} from "@/components/ui/button";
import {getRestaurants, Restaurant} from "@/services/restaurant.service";
import {RatingStar} from "@/components/ui/rating-star";
import {getReviews, Review} from "@/services/review.service";
import Image from "next/image";

export async function CurrentReviewTab({t, userId}: { t: (key: string) => string, userId: string }) {
    const recentReviews = await getReviews({userId, size: 999999});

    if (recentReviews.length === 0) {
        return <div className="text-center py-8 text-gray-500">{t('no_reviews')}</div>;
    }

    return (
        <div className="grid gap-6">
            {recentReviews.map((review: Review) => <ReviewCard key={review.id} review={review}/>)}
        </div>
    );
}

export async function FollowingTab({t, userId}: { t: (key: string) => string, userId: string }) {
    const followingRestaurants = await getRestaurants({followBy: userId, size: 999999});

    if (followingRestaurants.length === 0) {
        return <div className="text-center py-8 text-gray-500">{t('no_following')}</div>;
    }

    return (
        <div className="grid gap-6">
            {followingRestaurants.map((restaurant) => (
                <FollowingItemCard key={restaurant.id} restaurant={restaurant}/>
            ))}
        </div>
    );
}

export const UserProfileCard = async () => {
    const [profile, cuisines] = await Promise.all([getCurrentUserInfo(), getCuisines()])
    return (
        <Card className="border-gray-100 mb-6">
            <CardContent
                className="p-8 flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex flex-col space-y-4 items-center justify-center mb-4">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={profile.avatarUrl} alt={profile.displayName}/>
                        <AvatarFallback>{profile.displayName}</AvatarFallback>
                    </Avatar>
                    <EditProfileModal
                        userProfile={profile}
                        cuisines={cuisines ?? []}
                    />
                </div>

                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.displayName}</h1>

                    <div className="space-y-2 mb-4">
                        <div className="flex flex-wrap gap-1">
                            {profile.favCuisines && profile.favCuisines.length > 0 && profile.favCuisines.map((pref) => (
                                <Badge key={pref.id} className="text-xs bg-orange-500 text-white">
                                    {pref.name}
                                </Badge>
                            ))}
                        </div>
                        <Badge variant={"outline"} className="text-xs space-x-1 text-orange-500">
                            <CircleDollarSign className="size-4 inline"/>
                            <span className={"align-middle text-xl"}>{profile.budget}</span>
                        </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 max-w-md">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{profile.reviewCount}</div>
                            <div className="text-sm text-gray-600">Reviews</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{profile.averageRating?.toFixed(1)}</div>
                            <div className="text-sm text-gray-600">Average rating</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const FollowingItemCard = ({restaurant}: { restaurant: Restaurant }) => {
    return (
        <Card key={restaurant.id} className="border-gray-100">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={restaurant.coverImage ?? "/logo.svg"} alt={restaurant.name}/>
                        <AvatarFallback>{restaurant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3"/>
                                <span>{restaurant.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link href={`/restaurant/${restaurant.id}`}>
                            <Button variant="outline" className="text-sm text-gray-700 hover:text-orange-500">
                                View Restaurant
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function ReviewCard({review}: { review: Review }) {
    return (
        <Card className="border-gray-100">
            <CardHeader>
                <div className="flex items-start space-x-4 justify-between">
                    <div className="flex items-center space-x-4">
                        <Image
                            alt={review.dishName}
                            src={review.dishImage ?? "/logo.svg"}
                            width={512} height={512}
                            className="rounded-full size-12"
                        />
                        <span>
                            <Link href={`/restaurant/${review.restaurantId}/${review.dishId}`}
                                  className="font-semibold text-gray-900 hover:text-orange-500"
                            >
                                {review.dishName}
                            </Link> <br/>
                            <Link href={`/restaurant/${review.restaurantId}`}
                                  className="text-sm text-gray-600 hover:text-orange-500"
                            >
                                {review.restaurantName}
                            </Link> <br/>
                            <span className={"text-xs"}>{new Date(review.createdAt).toLocaleString()}</span>
                        </span>
                    </div>
                    <RatingStar rating={review.rating}/>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700 mb-4 text-xl">{review.comment}</p>
            </CardContent>
        </Card>
    )
}