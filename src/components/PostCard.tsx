"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Heart, MessageCircle} from "lucide-react";
import {Link} from "@/i18n/navigation";
import Image from "next/image";
import {Post} from "@/services/post.service";

const PostCard = ({post}: { post: Post }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(post.engagement.likes);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100">
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                    <Link href={`/restaurant/${post.author.restaurantId}`}>
                        <Avatar
                            className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-orange-200 transition-all">
                            <AvatarImage src={post.author.avatar} alt={post.author.name}/>
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
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{post.timestamp}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900">{post.content.title}</h4>
                    <p className="text-gray-700 leading-relaxed">{post.content.description}</p>
                </div>

                {/* Images */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {post.content?.images
                        .map((image, index) =>
                            <Image
                                className={"w-full h-60 md:h-80 lg:h-100  rounded-lg"}
                                key={"post-image-" + index}
                                src={image}
                                alt={image}
                                width={1920}
                                height={1920}
                            />
                        )
                    }
                </div>

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
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}/>
                            <span>{likes}</span>
                        </Button>

                        <Button variant="ghost" size="sm" className="space-x-2 text-gray-600 hover:text-blue-500">
                            <MessageCircle className="w-4 h-4"/>
                            <span>{post.engagement.comments}</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PostCard;