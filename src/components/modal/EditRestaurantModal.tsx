import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Camera, MapPin, Phone, Mail, Clock, Globe} from "lucide-react";
import {toast} from "sonner";
import {Restaurant, updateRestaurant} from "@/services/restaurant.service";
import Image from "next/image";

interface EditRestaurantModalProps {
    isOpen: boolean;
    onClose: () => void;
    restaurant: Restaurant;
}

const EditRestaurantModal = ({isOpen, onClose, restaurant}: EditRestaurantModalProps) => {
    const [formData, setFormData] = useState({
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        phone: restaurant.phone,
        email: restaurant.email,
        website: restaurant.website,
        openHour: restaurant.openHour,
        coverImage: restaurant.coverImage,
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const handleImageUpload = (type: 'image' | 'coverImage') => {
        // Simulate image upload
        const mockImageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800`;
        setFormData(prev => ({...prev, [type]: mockImageUrl}));
    };

    const handleSave = () => {
        updateRestaurant(formData.id, formData).then(() => {
            toast.info("Restaurant Updated", {
                description: "Your restaurant profile has been successfully updated.",
            });
        }).finally(() => {
            onClose();
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Restaurant Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Images Section */}
                    <div className="space-y-4">
                        <div>
                            <Label className="text-base font-medium">Cover Image</Label>
                            <div className="mt-2 relative h-32 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={formData.coverImage ?? "/"}
                                    alt="Cover"
                                    width={1800}
                                    height={1200}
                                    className="w-full h-full object-cover"
                                />
                                <Button
                                    onClick={() => handleImageUpload('coverImage')}
                                    size="sm"
                                    className="absolute top-2 right-2"
                                >
                                    <Camera className="w-4 h-4 mr-2"/>
                                    Change
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Restaurant Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter restaurant name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Describe your restaurant, atmosphere, and what makes it special..."
                            rows={3}
                        />
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <div className="relative">
                                <MapPin
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    placeholder="Full restaurant address"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    placeholder="(555) 123-4567"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="restaurant@example.com"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <div className="relative">
                                <Globe
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    id="website"
                                    value={formData.website}
                                    onChange={(e) => handleInputChange("website", e.target.value)}
                                    placeholder="www.yourrestaurant.com"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="hours">Operating Hours</Label>
                            <div className="relative">
                                <Clock
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    id="hours"
                                    value={formData.openHour}
                                    onChange={(e) => handleInputChange("hours", e.target.value)}
                                    placeholder="Mon-Sun: 11:00 AM - 10:00 PM"
                                    className="pl-10"
                                />
                            </div>
                        </div>
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

export default EditRestaurantModal;