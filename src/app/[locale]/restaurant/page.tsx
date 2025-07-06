import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Clock, Globe, MapPin, Phone} from "lucide-react";
import RestaurantRegistryPrompt from "@/components/RestaurantRegistryPrompt";
import {Link} from "@/i18n/navigation";
import PostCard from "@/components/PostCard";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {getRestaurants, Restaurant} from "@/services/restaurant.service";
import {getAuthSession} from "@/configs/auth.config";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";
import {RatingStar} from "@/components/ui/rating-star";
import {AddDishButton, EditRestaurantButton, MenuItemController} from "@/app/[locale]/restaurant/component";
import Loading from "@/components/loading";
import {Suspense} from "react";
import {getDish, ShortDishProps} from "@/services/dish.service";
import {fetchPosts} from "@/services/post.service";
import {RecentReviews} from "@/app/[locale]/restaurant/[restaurantId]/components";

interface PageProps {
    params: Promise<{ locale: string }>;
}


export default async function RestaurantManagePage({params}: Readonly<PageProps>) {
    const {locale} = await params;
    setRequestLocale(locale)
    const [t, session] = await Promise.all([getTranslations("restaurant"), getAuthSession()]);
    const restaurant = (await getRestaurants({managedBy: session?.user?.id}))?.[0];
    if (!restaurant) {
        return <RestaurantRegistryPrompt/>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-4">
                <Image
                    src={restaurant.coverImage ?? "/logo.svg"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    width={1980}
                    height={720}
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute bottom-6 left-6 text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
                    <p className="mb-6">{restaurant.description}</p>
                </div>
            </div>
            <RestaurantInfoCard restaurant={restaurant} t={t}/>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
            <p className="text-gray-600">{t('subtitle')}</p>
            <Tabs defaultValue={"menu"} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                    <TabsTrigger value="menu">{t('tabs.menu')}</TabsTrigger>
                    <TabsTrigger value="posts">{t('tabs.posts')}</TabsTrigger>
                    <TabsTrigger value="reviews">{t('tabs.reviews')}</TabsTrigger>
                </TabsList>
                <TabsContent value="menu" className="space-y-6">
                    <Suspense fallback={<Loading/>}>
                        <RestaurantMenuTab restaurant={restaurant}/>
                    </Suspense>
                </TabsContent>
                <TabsContent value="posts" className="space-y-6">
                    <Suspense fallback={<Loading/>}>
                        <RestaurantPostsTab t={t} restaurant={restaurant}/>
                    </Suspense>
                </TabsContent>
                <TabsContent value="reviews" className="space-y-6">
                    <Suspense fallback={<Loading/>}>
                        <RecentReviews t={t} restaurantId={restaurant.id}/>
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>

    );
}

function RestaurantInfoCard({t, restaurant}: { t: (key: string) => string, restaurant: Restaurant }) {
    return (
        <Card className="border-gray-100 mb-6">
            <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1">
                            <RatingStar rating={restaurant.averageRating}/>
                        </div>
                        <span className="text-lg font-semibold">{restaurant.averageRating}</span>
                        <span className="text-gray-600">({restaurant.reviewCount} reviews)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500"/>
                            <span>{restaurant.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500"/>
                            <span>{restaurant.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500"/>
                            <span>{restaurant.openHour}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-gray-500"/>
                            <span>{restaurant.website}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div
                                className="text-2xl font-bold text-gray-900">{restaurant.followerCount.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Followers</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{restaurant.postCount}</div>
                            <div className="text-sm text-gray-600">Posts</div>
                        </div>
                        <EditRestaurantButton restaurant={restaurant}/>
                        <Button variant={"outline"}>
                            <Link href={`/restaurant/${restaurant.id}`}>
                                {t('view-public-profile')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

async function RestaurantPostsTab({t, restaurant}: { t: (key: string) => string, restaurant: Restaurant }) {
    const posts = await fetchPosts({restaurantId: restaurant.id})
    return (
        <Card className="border-gray-100">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{t('manage-posts')}</CardTitle>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                        {t('create-post')}
                    </Button>
                </div>
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
}

async function RestaurantMenuTab({ restaurant}: {restaurant: Restaurant }) {
    const dishes = await getDish({restaurantId: restaurant.id});
    return (
        <Card className="border-gray-100">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Menu Management</CardTitle>
                    <AddDishButton restaurant={restaurant}/>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {dishes.map((item) => (
                        <MenuItem key={item.id} dish={item}/>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function MenuItem({dish}: { dish: ShortDishProps }) {
    return (
        <div key={dish.id}
             className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
                <Image
                    src={dish.images?.[0] ?? "/logo.svg"}
                    alt={dish.name}
                    width={1920}
                    height={1080}
                    className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{dish.name}</h4>
                        <Badge variant="outline" className="capitalize">
                            {dish.cuisine}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{dish.description}</p>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{dish.price}</p>
                </div>

                <MenuItemController dish={dish}/>
            </div>
        </div>
    )
}