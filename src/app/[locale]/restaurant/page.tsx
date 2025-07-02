import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Star} from "lucide-react";
import RestaurantRegistryPrompt from "@/components/RestaurantRegistryPrompt";
import {Link} from "@/i18n/navigation";
import PostCard from "@/components/PostCard";
import {getTranslations} from "next-intl/server";
import {fetchUserRestaurant} from "@/services/restaurant.service";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function RestaurantManagePage({params}: Readonly<PageProps>){
    const [t, userRestaurant] = await Promise.all([
        getTranslations("dashboard"),
        fetchUserRestaurant()
    ]);

    return (
        <div className="container mx-auto px-4 py-6">
            {userRestaurant ? (
                <>
                    {/* Header */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
                            <p className="text-gray-600">{t('subtitle')}</p>
                        </div>
                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            <Button className="bg-orange-500 hover:bg-orange-600">
                                {t('create-post')}
                            </Button>
                            <Button variant={"outline"}>
                                <Link href={`/restaurant/${userRestaurant.id}`}>
                                    {t('view-public-profile')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                    {/* Content */}
                    <Tabs defaultValue={"menu"} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                            <TabsTrigger value="menu">{t('tabs.menu')}</TabsTrigger>
                            <TabsTrigger value="posts">{t('tabs.posts')}</TabsTrigger>
                            <TabsTrigger value="reviews">{t('tabs.reviews')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="menu" className="space-y-6">
                            <Card className="border-gray-100">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{t('menu.title')}</CardTitle>
                                        <Button className="bg-orange-500 hover:bg-orange-600">
                                            {t('menu.add-dish')}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {userRestaurant.menu?.map((post: any) => (
                                            <PostCard key={post.id} post={post}/>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="posts" className="space-y-6">
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
                                        {userRestaurant.posts.map((post: any) => (
                                            <PostCard key={post.id} post={post}/>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="reviews" className="space-y-6">
                            <Card className="border-gray-100">
                                <CardHeader>
                                    <CardTitle>{t('customer-reviews')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-12">
                                        <Star className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('review-management-coming-soon')}</h3>
                                        <p className="text-gray-600">{t('review-management-desc')}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </>
            ) : (
                <RestaurantRegistryPrompt/>
            )}
        </div>
    );
}
