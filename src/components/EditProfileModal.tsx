"use client";
import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Camera, X, Plus, Edit} from "lucide-react";
import {toast} from "sonner";
import {Cuisine} from "@/services/cuisine.service";
import {UserInfo} from "@/services/auth.service";
import {useRouter} from "@/i18n/navigation";

interface EditProfileModalProps {
    userProfile: UserInfo
    cuisines: Cuisine[]
}

const EditProfileModal = ({userProfile, cuisines}: EditProfileModalProps) => {
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [formData, setFormData] = useState<UserInfo>(userProfile);

    const [newPreference, setNewPreference] = useState<string>("");

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const handleAddPreference = () => {
        if (newPreference && !formData.favCuisines?.map(cuisine => `${cuisine.id}`).includes(newPreference)) {
            setFormData(prev => ({
                ...prev,
                favCuisines: [...(prev.favCuisines ?? []), newPreference]
            }));
            setNewPreference("");
        }
    };

    const handleRemovePreference = (preference: number) => {
        setFormData(prev => ({
            ...prev,
            preferences: prev.favCuisines?.filter(p => p.id !== preference)
        }));
    };

    const onClose = () => {
        setIsEditModalOpen(false);
    }


    const handleAvatarChange = () => {
        const mockAvatarUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400`;
        setFormData(prev => ({...prev, imageUrl: mockAvatarUrl}));
    };

    const handleSave = () => {
        toast.info("Profile updated successfully!");
        router.refresh();
        setIsEditModalOpen(false);
    };

    return (
        <>
            <Button
                className="bg-orange-500 hover:bg-orange-600 flex items-center"
                onClick={() => setIsEditModalOpen(true)}
            >
                <Edit className="w-4 h-4 mr-2"/>
                Edit Profile
            </Button>
            <Dialog open={isEditModalOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center space-x-4">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={formData.avatarUrl ?? "/logo.svg"} alt={formData.username}/>
                                <AvatarFallback>{formData.username}</AvatarFallback>
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
                                    value={formData.displayName}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
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
                            <Label htmlFor="bio">Budget</Label>
                            <Input
                                id="budget"
                                type="number"
                                value={formData.budget}
                                onChange={(e) => handleInputChange("budget", e.target.value)}
                                placeholder="Enter your budget"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Cuisine Preferences</Label>
                            <div className="flex space-x-2">
                                <Select value={newPreference} onValueChange={setNewPreference}>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Add cuisine preference"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cuisines
                                            .filter(cuisine => !formData.favCuisines
                                                .map(cuisine => cuisine.urlName)
                                                .includes(cuisine.urlName))
                                            .map(
                                                (cuisine) => (
                                                    <SelectItem key={cuisine.id} value={cuisine.urlName}>
                                                        {cuisine.name}
                                                    </SelectItem>
                                                )
                                            )
                                        }
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAddPreference} size="icon" variant="outline">
                                    <Plus className="w-4 h-4"/>
                                </Button>
                            </div>
                            {formData.favCuisines.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.favCuisines.map((preference) => (
                                        <Badge key={preference.urlName} variant="outline"
                                               className="flex items-center space-x-1">
                                            <span>{preference.name}</span>
                                            <button
                                                onClick={() => handleRemovePreference(preference.urlName)}
                                                className="ml-1 hover:text-red-500"
                                            >
                                                <X className="w-3 h-3"/>
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

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
        </>
    );
};

export default EditProfileModal;