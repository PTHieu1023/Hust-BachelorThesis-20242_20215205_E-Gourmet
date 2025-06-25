import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MapPin, DollarSign } from "lucide-react";
import {Link} from "@/i18n/navigation";

interface PostCardProps {
    post: {
        id: string;
        type: "restaurant";
        author: {
            name: string;
            avatar: string;
            isRestaurant: true;
            restaurantId: string;
        };
        content: {
            title: string;
            description: string;
            images: string[];
            price?: string;
            category: "menu" | "special" | "event" | "announcement";
        };
        engagement: {
            likes: number;
            comments: number;
            shares: number;
        };
        timestamp: string;
        cuisine: string;
        location?: string;
    };
}

const PostCard = ({ post }: PostCardProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(post.engagement.likes);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "menu": return "bg-blue-100 text-blue-700";
            case "special": return "bg-purple-100 text-purple-700";
            case "event": return "bg-green-100 text-green-700";
            case "announcement": return "bg-orange-100 text-orange-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case "menu": return "Menu Item";
            case "special": return "Daily Special";
            case "event": return "Event";
            case "announcement": return "Announcement";
            default: return category;
        }
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link href={`/restaurant/${post.author.restaurantId}`}>
                            <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-orange-200 transition-all">
                                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                <AvatarFallback>{post.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Link>

                        <div>
                            <div className="flex items-center space-x-2">
                                <Link href={`/restaurant/${post.author.restaurantId}`}>
                                    <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors cursor-pointer">
                                        {post.author.name}
                                    </h3>
                                </Link>
                                <Badge className="bg-orange-100 text-orange-700 text-xs">Restaurant</Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{post.timestamp}</span>
                                {post.location && (
                                    <>
                                        <span>•</span>
                                        <div className="flex items-center space-x-1">
                                            <MapPin className="w-3 h-3" />
                                            <span>{post.location}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(post.content.category)}>
                            {getCategoryLabel(post.content.category)}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                            {post.cuisine}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{post.content.title}</h4>
                        {post.content.price && (
                            <div className="flex items-center space-x-1 text-orange-600 font-bold">
                                <DollarSign className="w-4 h-4" />
                                <span>{post.content.price.replace('$', '')}</span>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{post.content.description}</p>
                </div>

                {/* Images */}
                {post.content.images.length > 0 && (
                    <div className={`grid gap-2 rounded-xl overflow-hidden ${
                        post.content.images.length === 1
                            ? "grid-cols-1"
                            : post.content.images.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-2"
                    }`}>
                        {post.content.images.slice(0, 4).map((image, index) => (
                            <div
                                key={index}
                                className={`relative overflow-hidden bg-gray-100 ${
                                    post.content.images.length === 1 ? "aspect-[16/10]" : "aspect-square"
                                } ${
                                    post.content.images.length === 3 && index === 0 ? "row-span-2" : ""
                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                                {post.content.images.length > 4 && index === 3 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      +{post.content.images.length - 4} more
                    </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Engagement */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLike}
                            className={`space-x-2 transition-colors ${
                                isLiked ? "text-red-500 hover:text-red-600" : "text-gray-600 hover:text-red-500"
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                            <span>{likes}</span>
                        </Button>

                        <Button variant="ghost" size="sm" className="space-x-2 text-gray-600 hover:text-blue-500">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.engagement.comments}</span>
                        </Button>

                        <Button variant="ghost" size="sm" className="space-x-2 text-gray-600 hover:text-green-500">
                            <Share2 className="w-4 h-4" />
                            <span>{post.engagement.shares}</span>
                        </Button>
                    </div>

                    <div className="flex space-x-2">
                        <Link href={`/restaurant/${post.author.restaurantId}`}>
                            <Button size="sm" variant="outline" className="hover:bg-orange-50 hover:border-orange-200">
                                View Restaurant
                            </Button>
                        </Link>
                        {(post.content.category === "menu" || post.content.category === "special") && (
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                Order Now
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PostCard;