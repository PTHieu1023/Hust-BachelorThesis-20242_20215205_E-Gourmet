"use client";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Edit, Heart, MapPin, Star} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useSession} from "next-auth/react";
import {KCSession} from "@/configs/auth.config";
import {Badge} from "@/components/ui/badge";
import EditProfileModal from "@/components/EditProfileModal";
import {useState} from "react";
import {Link} from "@/i18n/navigation";

export const UserProfileCard = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profile, setProfile] = useState({
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        username: "user",
        reviews: 89,
        followers: 1247,
        following: 342,
        likes: 2156,
        bio: "Food enthusiast and restaurant explorer based in San Francisco. Love discovering hidden gems and sharing culinary adventures!",
        address: "San Francisco, CA",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b812b6ab?w=400",
        preferences: ["Italian", "Japanese", "Mediterranean"]
    });

    const handleSaveProfile = (updatedProfile: any) => {
        setProfile(updatedProfile);
    };

    const {data} = useSession();
    const user = data?.user as KCSession["user"] | undefined;
    const isCurrentUser = user?.username === profile.username;

    return (
        <Card className="border-gray-100 mb-6">
            <CardContent className="p-8">
                <div
                    className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
                    <div className="flex flex-col space-y-4 items-center justify-center mb-4">
                        <Avatar className="w-32 h-32">
                            <AvatarImage src={profile.avatar} alt={profile.name}/>
                            <AvatarFallback>{profile.name}</AvatarFallback>
                        </Avatar>
                        <Button
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={isCurrentUser ? () => setIsEditModalOpen(true) : () => alert("Follow User")}
                        >
                            {isCurrentUser ? (
                                <div className="flex items-center">
                                    <Edit className="w-4 h-4 mr-2"/>
                                    Edit Profile
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Heart className="w-4 h-4 mr-2"/>
                                    Follow User
                                </div>
                            )}
                        </Button>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                        <p className="text-gray-600 mb-3">{profile.bio}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                            <MapPin className="w-4 h-4"/>
                            <span>{profile.address}</span>
                        </div>

                        {/* Preferences and Dietary Restrictions */}
                        <div className="space-y-2 mb-4">
                            {profile.preferences.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Loves:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {profile.preferences.map((pref) => (
                                            <Badge key={pref} variant="outline" className="text-xs">
                                                {pref}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-4 max-w-md">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{profile.reviews}</div>
                                <div className="text-sm text-gray-600">Reviews</div>
                            </div>
                            <div className="text-center">
                                <div
                                    className="text-2xl font-bold text-gray-900">{profile.followers}</div>
                                <div className="text-sm text-gray-600">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{profile.following}</div>
                                <div className="text-sm text-gray-600">Following</div>
                            </div>
                            <div className="text-center">
                                <div
                                    className="text-2xl font-bold text-gray-900">{profile.likes}</div>
                                <div className="text-sm text-gray-600">Likes</div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userProfile={profile}
                onSave={handleSaveProfile}
            />
        </Card>
    )
}

export const FollowingItemCard = ({item}: {item: any}) => {
    return (
        <Card key={item.id} className="border-gray-100">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={item.avatar} alt={item.name}/>
                        <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.bio}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3"/>
                                <span>{item.location}</span>
                            </div>
                            <span>•</span>
                            <span>{item.cuisine}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/>
                                <span>{item.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{item.followers} followers</span>
                            <span>•</span>
                            <span>Posted {item.lastPost}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link href={`/restaurant/${item.id}`}>
                            <Button variant="outline" size="sm">
                                View Restaurant
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}