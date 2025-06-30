"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Star, MessageCircle } from "lucide-react";
import RestaurantRegistryPrompt from "@/components/RestaurantRegistryPrompt";
import { fetchStats, fetchRecentPosts, Stat, RecentPost } from "@/services/restaurant.service";
import { useTranslations } from "next-intl";

const stats = [
    { label: "Total Followers", value: "2,847", change: "+12%", icon: Users, color: "text-blue-600" },
    { label: "Posts This Month", value: "24", change: "+8%", icon: TrendingUp, color: "text-green-600" },
    { label: "Average Rating", value: "4.8", change: "+0.2", icon: Star, color: "text-yellow-600" },
    { label: "Total Reviews", value: "156", change: "+18%", icon: MessageCircle, color: "text-purple-600" },
];

const recentPosts = [
    {
        id: "1",
        title: "Fresh Truffle Pasta Special",
        engagement: { likes: 89, comments: 12, shares: 5 },
        status: "published",
        date: "2024-01-15"
    },
    {
        id: "2",
        title: "Weekend Brunch Menu Launch",
        engagement: { likes: 156, comments: 28, shares: 15 },
        status: "published",
        date: "2024-01-14"
    },
    {
        id: "3",
        title: "Chef's Special: Seafood Risotto",
        engagement: { likes: 234, comments: 45, shares: 22 },
        status: "published",
        date: "2024-01-13"
    }
];

const iconMap = {
    Users,
    TrendingUp,
    Star,
    MessageCircle,
};

function StatsGrid({ stats, t }: { stats: Stat[], t: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
                const Icon = iconMap[stat.icon as keyof typeof iconMap];
                return (
                    <Card key={stat.label} className="border-gray-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                                </div>
                                <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                                    {Icon && <Icon className="w-6 h-6" />}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

function RecentPosts({ recentPosts, t }: { recentPosts: RecentPost[], t: any }) {
    return (
        <Card className="border-gray-100">
            <CardHeader>
                <CardTitle>{t('recent-posts')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{post.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{post.engagement.likes} {t('likes')}</span>
                                <span>{post.engagement.comments} {t('comments')}</span>
                                <span>{post.engagement.shares} {t('shares')}</span>
                            </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                            {post.status}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function QuickActions({ t }: { t: any }) {
    return (
        <Card className="border-gray-100">
            <CardHeader>
                <CardTitle>{t('quick-actions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-orange-500 hover:bg-orange-600">
                    {t('create-food-post')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                    {t('update-menu')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                    {t('respond-to-reviews')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                    {t('schedule-promotion')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                    {t('view-analytics')}
                </Button>
            </CardContent>
        </Card>
    );
}

export default function RestaurantManagePage() {
    const t = useTranslations("dashboard");
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState<Stat[]>([]);
    const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);

    useEffect(() => {
        async function loadData() {
            setStats(await fetchStats());
            setRecentPosts(await fetchRecentPosts());
        }
        loadData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-6">
            <RestaurantRegistryPrompt />
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
                    <Button variant="outline">
                        {t('view-public-profile')}
                    </Button>
                </div>
            </div>
            <StatsGrid stats={stats} t={t} />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                    <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
                    <TabsTrigger value="posts">{t('tabs.posts')}</TabsTrigger>
                    <TabsTrigger value="reviews">{t('tabs.reviews')}</TabsTrigger>
                    <TabsTrigger value="analytics">{t('tabs.analytics')}</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RecentPosts recentPosts={recentPosts} t={t} />
                        <QuickActions t={t} />
                    </div>
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
                            <div className="text-center py-12">
                                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('post-management-coming-soon')}</h3>
                                <p className="text-gray-600">{t('post-management-desc')}</p>
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
                                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('review-management-coming-soon')}</h3>
                                <p className="text-gray-600">{t('review-management-desc')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="analytics" className="space-y-6">
                    <Card className="border-gray-100">
                        <CardHeader>
                            <CardTitle>{t('analytics-dashboard')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('analytics-coming-soon')}</h3>
                                <p className="text-gray-600">{t('analytics-desc')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
