import {fetchPosts} from "@/services/post.service";
import PostCard from "@/components/PostCard";
import {Suspense} from "react";
import Loading from "@/components/loading";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Star} from "lucide-react";
import {getRecommendations, Recommendation} from "@/services/dish.service";
import {Link} from "@/i18n/navigation";
import {Button} from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Suspense fallback={<Loading/>}>
                        <PostsContent/>
                    </Suspense>
                </div>


                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-gray-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2 text-lg">
                                <Star className="w-5 h-5 text-orange-500"/>
                                <span>For you</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Suspense fallback={<Loading/>}>
                                <DiscoveryPanelContent/>
                            </Suspense>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

const PostsContent = async () => {
    const posts = await fetchPosts();
    if (!posts?.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                No posts available at the moment.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <PostCard key={post.id} post={post}/>
            ))}
        </div>
    )
};

const DiscoveryPanelContent = async () => {
    const recommendations = await getRecommendations({size: 3});
    return (
        <div className="space-y-4">
            <RecommendationItems recommendations={recommendations}/>
            <Link href="/for-you">
                <Button variant="outline" className="w-full mt-4 hover:bg-orange-50 hover:border-orange-200">
                    View more
                </Button>
            </Link>
        </div>
    );
};

const RecommendationItems = ({recommendations}: { recommendations: Recommendation[] }) => {
    if (!recommendations.length) {
        return (
            <div className="text-center py-4 text-gray-500">
                No recommendations available at the moment.
            </div>
        );
    }

    return recommendations.map((item) => (
        <Link href={`/restaurant/${item.restaurantUsername}/${item.urlName}`}
              key={item.id}
              className="flex items-center space-x-3 group cursor-pointer"
        >
            <Image
                src={item.image ?? "/logo.svg"}
                alt={item.title}
                className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                width={1920}
                height={1920}
            />
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                    {item.title}
                </h4>
                <div className="flex items-center space-x-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/>
                    <span className="text-xs text-gray-600">{item.rating}</span>
                </div>
            </div>
        </Link>
    ))
};