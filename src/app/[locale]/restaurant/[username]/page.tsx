import {Suspense} from "react";
import {
    getRestaurantMenuHighlights,
    getRestaurantProfile,
    getRestaurantRecentReviews
} from "@/services/restaurant.service";
import {getTranslations, setRequestLocale} from "next-intl/server";
import Image from "next/image";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Clock, Globe, Heart, Home, MapPin, Phone, Star} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {RatingStar} from "@/components/ui/rating-star";
import {Button} from "@/components/ui/button";
import CommonBreadcrumb, {BreadcrumbItemProps} from "@/components/layout/CommonBreadcrumb";

export default async function RestaurantProfilePage({params}: Readonly<{ params: Promise<{ locale: string, username: string }> }>) {
    const {locale, username} = await params;
    setRequestLocale(locale)
    const t = await getTranslations("restaurant");
    const breadcrumbItems:BreadcrumbItemProps[] = [
        {
            label: <Home className={"size-3"}/>,
            href: `/`,
            isCurrent: false
        },
        {
            label: username,
            href: `/restaurant/${username}`,
            isCurrent: true
        }
    ]

    return (
        <div className="container mx-auto px-4 py-6">
            <CommonBreadcrumb items={breadcrumbItems}/>
            <Suspense fallback={<div className="text-center py-4">{t('details.loading', {default: 'Loading...'})}</div>}>
                <RestaurantInfo t={t}/>
            </Suspense>
            <Tabs defaultValue="menu" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
                    <TabsTrigger value="menu">{t('tabs.menu')}</TabsTrigger>
                    <TabsTrigger value="posts">{t('tabs.posts')}</TabsTrigger>
                    <TabsTrigger value="reviews">{t('tabs.reviews')}</TabsTrigger>
                </TabsList>
                <TabsContent value="menu" className="space-y-6">
                    <Suspense fallback={<div className="text-center py-4">{t('details.loading', {default: 'Loading...'})}</div>}>
                        <MenuTab t={t}/>
                    </Suspense>
                </TabsContent>
                <TabsContent value="posts" className="space-y-6">
                    <Suspense fallback={<div className="text-center py-4">{t('details.loading', {default: 'Loading...'})}</div>}>
                        <PostTab t={t}/>
                    </Suspense>
                </TabsContent>
                <TabsContent value="reviews" className="space-y-6">
                    <Suspense fallback={<div className="text-center py-4">{t('details.loading', {default: 'Loading...'})}</div>}>
                        <ReviewTab t={t}/>
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
};

const RestaurantInfo = async ({t}: any) => {
    const restaurant = await getRestaurantProfile();
    return (
        <Card className="border-gray-100 mb-6">
            <CardTitle>
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6">
                    <Image src={restaurant.coverImage} alt={restaurant.name} width={1980} height={720} className="w-full h-full object-cover"/>
                    <div className="absolute bottom-6 left-6 text-white">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600">
                            <Heart className="w-4 h-4 mr-2"/>
                            {t('details.follow')}
                        </Button>
                    </div>
                </div>
            </CardTitle>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                                <span>{restaurant.hours}</span>
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
                                <div className="text-2xl font-bold text-gray-900">{restaurant.followers.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">{t('details.followers')}</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{restaurant.posts}</div>
                                <div className="text-sm text-gray-600">{t('details.posts')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const MenuTab = async ({t}: any) => {
    const menuHighlights = await getRestaurantMenuHighlights();
    return (
        <Card className="border-gray-100">
            <CardHeader>
                <CardTitle>{t('menu.highlights')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuHighlights.map((item: any) => (
                        <div key={item.id} className="group cursor-pointer">
                            <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                    <span className="font-bold text-orange-600">{item.price}</span>
                                </div>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                                    <span className="text-sm font-medium">{item.rating}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

const PostTab = async ({t}: any) => {
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
    )
}

const ReviewTab = async ({t}: any) => {
    const recentReviews = await getRestaurantRecentReviews();
    return (
        <div className="space-y-6">
            {recentReviews.map((review: any) => (
                <Card key={review.id} className="border-gray-100">
                    <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={review.avatar} alt={review.author}/>
                                <AvatarFallback>{review.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900">{review.author}</h4>
                                    <div className="flex items-center space-x-1">
                                        <RatingStar rating={review.rating}/>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-2">{review.review}</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{t('reviews.ordered', {default: 'Ordered'})}: {review.dish}</span>
                                    <span>{review.date}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}