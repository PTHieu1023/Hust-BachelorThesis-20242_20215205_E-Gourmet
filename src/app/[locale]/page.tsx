"use client"

import {useState} from "react";
import {mockPosts} from "@/data/mockData";
import PostCard from "@/components/PostCard";
import DiscoveryPanel from "@/components/DiscoverPanel";

export default function Home() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [posts] = useState(mockPosts);

    const filteredPosts = posts.filter(post => {
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