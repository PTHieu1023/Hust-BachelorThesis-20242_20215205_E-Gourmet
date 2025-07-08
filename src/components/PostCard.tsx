"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Heart, MessageCircle} from "lucide-react";
import {Link} from "@/i18n/navigation";
import {useTranslations} from "next-intl";
import Image from "next/image";
import {Post} from "@/services/post.service";

const PostCard = ({post}: { post: Post }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(post.likeCount);
    const t = useTranslations('post');

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100">
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                    <Link href={`/restaurant/${post.restaurantId}`}>
                        <Avatar
                            className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-orange-200 transition-all">
                            <AvatarImage src={post.restaurantAvatar} alt={post.restaurantName}/>
                            <AvatarFallback>{post.restaurantName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Link>

                    <div>
                        <div className="flex items-center space-x-2">
                            <Link href={`/restaurant/${post.restaurantId}`}>
                                <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors cursor-pointer">
                                    {post.restaurantName}
                                </h3>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900">{post.caption}</h4>
                    {post.media && post.media.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                            {post.media?.map((image) => (
                                <Image
                                    key={image}
                                    src={image}
                                    alt={t('media-alt')}
                                    width={500}
                                    height={500}
                                    className="rounded-lg object-fill"
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={handleLike}>
                        <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}/>
                        <span className="ml-2 text-sm text-gray-600">{likes} {t('likes')}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                        <MessageCircle className="w-5 h-5 text-gray-500"/>
                        <span className="ml-2 text-sm text-gray-600">{post.commentCount} {t('comments')}</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default PostCard;