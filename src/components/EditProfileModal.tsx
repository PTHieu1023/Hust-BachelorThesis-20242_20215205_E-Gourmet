"use client";
import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Camera, MapPin, X, Plus} from "lucide-react";
import {toast} from "sonner";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: {
        name: string,
        email: string,
        username: string,
        bio?: string,
        address?: string,
        avatar?: string,
        preferences?: string[]
    };
    onSave: (updatedProfile: any) => void;
}

const EditProfileModal = ({isOpen, onClose, userProfile, onSave}: EditProfileModalProps) => {
    const [formData, setFormData] = useState({
        name: userProfile.name,
        email: userProfile.email,
        bio: userProfile.bio,
        location: userProfile.address,
        avatar: userProfile.avatar,
        preferences: userProfile.preferences || [],
    });

    const [newPreference, setNewPreference] = useState("");

    const cuisineOptions = [
        "Italian", "Chinese", "Japanese", "Mexican", "Indian", "French", "Thai",
        "Mediterranean", "American", "Korean", "Vietnamese", "Greek", "Spanish"
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const handleAddPreference = () => {
        if (newPreference && !formData.preferences.includes(newPreference)) {
            setFormData(prev => ({
                ...prev,
                preferences: [...prev.preferences, newPreference]
            }));
            setNewPreference("");
        }
    };

    const handleRemovePreference = (preference: string) => {
        setFormData(prev => ({
            ...prev,
            preferences: prev.preferences.filter(p => p !== preference)
        }));
    };


    const handleAvatarChange = () => {
        const mockAvatarUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400`;
        setFormData(prev => ({...prev, avatar: mockAvatarUrl}));
    };

    const handleSave = () => {
        onSave(formData);
        toast.info("Profile updated successfully!");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={formData.avatar} alt={formData.name}/>
                            <AvatarFallback>{formData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <Button onClick={handleAvatarChange} variant="outline" size="sm">
                                <Camera className="w-4 h-4 mr-2"/>
                                Change Photo
                            </Button>
                            <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                            <MapPin
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                placeholder="City, State"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            placeholder="Tell us about yourself and your food preferences..."
                            rows={3}
                        />
                    </div>

                    {/* Cuisine Preferences */}
                    <div className="space-y-2">
                        <Label>Cuisine Preferences</Label>
                        <div className="flex space-x-2">
                            <Select value={newPreference} onValueChange={setNewPreference}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Add cuisine preference"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {cuisineOptions.filter(cuisine => !formData.preferences.includes(cuisine)).map((cuisine) => (
                                        <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleAddPreference} size="icon" variant="outline">
                                <Plus className="w-4 h-4"/>
                            </Button>
                        </div>
                        {formData.preferences.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.preferences.map((preference) => (
                                    <Badge key={preference} variant="outline" className="flex items-center space-x-1">
                                        <span>{preference}</span>
                                        <button
                                            onClick={() => handleRemovePreference(preference)}
                                            className="ml-1 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3"/>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-orange-500 hover:bg-orange-600"
                            onClick={handleSave}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileModal;