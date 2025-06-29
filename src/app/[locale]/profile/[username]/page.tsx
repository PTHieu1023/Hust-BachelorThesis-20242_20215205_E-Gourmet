import {Card, CardContent} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Star, Heart, Users} from "lucide-react";
import {FollowingItemCard, UserProfileCard} from "@/components/pages/user-profile";
import {getCurrentReview} from "@/services/review.service";
import {Suspense} from "react";
import {getFollowingRestaurants} from "@/services/restaurant.service";

const Profile = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <UserProfileCard/>

            <Tabs defaultValue="reviews" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[500px]">
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                </TabsList>

                <TabsContent value="reviews" className="space-y-6">
                    <Suspense fallback="Loading">
                        <CurrentReviewTab/>
                    </Suspense>
                </TabsContent>

                <TabsContent value="following" className="space-y-6">
                    <Suspense fallback="Loading">
                        <FollowingTab/>
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    )
};

const CurrentReviewTab = async () => {
    const recentReviews = await getCurrentReview();

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
    )
}

const FollowingTab = async () => {
    const followingList = await getFollowingRestaurants();
    return (
        <div className="sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-900">Following ({followingList?.length})</h2>
            <div className="grid gap-4">
                {followingList.map(item => <FollowingItemCard item={item} key={item?.id}/>)}
            </div>

            {followingList?.length === 0 && (
                <Card className="border-gray-100">
                    <CardContent className="p-12 text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default Profile;