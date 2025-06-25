"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Star, MessageCircle } from "lucide-react";
import RestaurantRegistryPrompt from "@/components/RestaurantRegistryPrompt";

export default function RestaurantManagePage() {
    const [activeTab, setActiveTab] = useState("overview");

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

    return (
            <div className="container mx-auto px-4 py-6">
                <RestaurantRegistryPrompt className={""}/>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Dashboard</h1>
                            <p className="text-gray-600">Manage your restaurant's presence on Savor Street</p>
                        </div>
                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            <Button className="bg-orange-500 hover:bg-orange-600">
                                Create New Post
                            </Button>
                            <Button variant="outline">
                                View Public Profile
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="border-gray-100">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                                    </div>
                                    <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Posts */}
                            <Card className="border-gray-100">
                                <CardHeader>
                                    <CardTitle>Recent Posts</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {recentPosts.map((post) => (
                                        <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 mb-1">{post.title}</h4>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <span>{post.engagement.likes} likes</span>
                                                    <span>{post.engagement.comments} comments</span>
                                                    <span>{post.engagement.shares} shares</span>
                                                </div>
                                            </div>
                                            <Badge className="bg-green-100 text-green-700">
                                                {post.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="border-gray-100">
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full justify-start bg-orange-500 hover:bg-orange-600">
                                        Create Food Post
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        Update Menu
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        Respond to Reviews
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        Schedule Promotion
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        View Analytics
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="posts" className="space-y-6">
                        <Card className="border-gray-100">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Manage Posts</CardTitle>
                                    <Button className="bg-orange-500 hover:bg-orange-600">
                                        Create New Post
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Post Management Coming Soon</h3>
                                    <p className="text-gray-600">Advanced post management features will be available here.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reviews" className="space-y-6">
                        <Card className="border-gray-100">
                            <CardHeader>
                                <CardTitle>Customer Reviews</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Review Management Coming Soon</h3>
                                    <p className="text-gray-600">Respond to and manage customer reviews here.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        <Card className="border-gray-100">
                            <CardHeader>
                                <CardTitle>Analytics Dashboard</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                                    <p className="text-gray-600">Detailed analytics and insights will be available here.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
    );
};
