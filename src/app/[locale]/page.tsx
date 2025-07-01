import {fetchPosts} from "@/services/post.service";
import PostCard from "@/components/PostCard";
import DiscoveryPanel from "@/components/DiscoverPanel";

export default async function Home() {
    const posts = await fetchPosts();

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post}/>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <DiscoveryPanel/>
                </div>
            </div>
        </div>
    )
}