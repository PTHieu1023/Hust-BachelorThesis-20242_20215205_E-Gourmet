"use client"

import {useEffect, useState} from "react";
import {fetchPosts} from "@/services/post.service";
import PostCard from "@/components/PostCard";
import DiscoveryPanel from "@/components/DiscoverPanel";
import { Post } from "@/services/post.type";
import { useTranslations } from "next-intl";

export default function Home() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        async function loadPosts() {
            const fetchedPosts = await fetchPosts();
            setPosts(fetchedPosts);
        }

        loadPosts();
    }, []);

    const filteredPosts = posts.filter((post: Post) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "menu") return post.content.category === "menu";
        if (activeFilter === "specials") return post.content.category === "special";
        if (activeFilter === "events") return post.content.category === "event";
        if (activeFilter === "announcements") return post.content.category === "announcement";
        return post.cuisine === activeFilter;
    });

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="space-y-6">
                        {filteredPosts.map((post) => (
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