"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {FormEvent, useState} from "react";
import {MapPin, Clock, Phone, Mail, Building2, Upload, CheckCircle} from "lucide-react";
import {toast} from "sonner";
import {useRouter} from "@/i18n/navigation";

const CreateRestaurant = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        cuisine: "",
        address: "",
        phone: "",
        email: "",
        description: "",
        hours: "",
        website: ""
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate required fields
        const requiredFields = ['name', 'cuisine', 'address', 'phone', 'email', 'hours'];
        // @ts-ignore
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            toast.error("Please fill in all required fields: " + missingFields.join(", "));
            setIsSubmitting(false);
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log("Restaurant registration data:", formData);

            toast.info("Your restaurant is being registered. You will receive a confirmation email once approved.");

            router.push("/restaurant");
        } catch (error) {
            toast.error("An error occurred while registering your restaurant. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const cuisineTypes = [
        "Italian", "Chinese", "Japanese", "Mexican", "Indian", "French", "Thai",
        "Mediterranean", "American", "Korean", "Vietnamese", "Greek", "Spanish",
        "Middle Eastern", "African", "Fusion", "Vegetarian", "Vegan", "Other"
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div
                        className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-white"/>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Restaurant</h1>
                    <p className="text-gray-600">Join E-Gourmet and connect with food lovers in your area</p>
                </div>

                <Card className="border-gray-100">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Building2 className="w-5 h-5 text-orange-500"/>
                            <span>Restaurant Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Restaurant Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter restaurant name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cuisine">Cuisine Type *</Label>
                                    <Select onValueChange={(value) => handleInputChange("cuisine", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select cuisine type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cuisineTypes.map((cuisine) => (
                                                <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                                                    {cuisine}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address *</Label>
                                <div className="relative">
                                    <MapPin
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                    <Input
                                        id="address"
                                        placeholder="Full restaurant address"
                                        className="pl-10"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <div className="relative">
                                        <Phone
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                        <Input
                                            id="phone"
                                            placeholder="(555) 123-4567"
                                            className="pl-10"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="restaurant@example.com"
                                            className="pl-10"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="hours">Operating Hours *</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 text-gray-400 w-4 h-4"/>
                                        <Input
                                            id="hours"
                                            placeholder="e.g., Mon-Sun: 11:00 AM - 10:00 PM"
                                            className="pl-10"
                                            value={formData.hours}
                                            onChange={(e) => handleInputChange("hours", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Website (Optional)</Label>
                                    <Input
                                        id="website"
                                        placeholder="https://yourrestaurant.com"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange("website", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Tell customers about your restaurant, specialties, and what makes you unique..."
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                />
                            </div>

                            {/* Photo Upload Section */}
                            <div className="space-y-2">
                                <Label>Restaurant Photos (Optional)</Label>
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-300 transition-colors">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2"/>
                                    <p className="text-sm text-gray-600 mb-2">Upload photos of your restaurant</p>
                                    <p className="text-xs text-gray-500 mb-3">JPG, PNG up to 10MB each</p>
                                    <Button type="button" variant="outline" size="sm">
                                        Choose Files
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5"/>
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">What happens next?</p>
                                        <ul className="space-y-1 text-blue-700">
                                            <li>• Your restaurant will be reviewed within 24 hours</li>
                                            <li>• You'll receive an email confirmation once approved</li>
                                            <li>• You can then access your business dashboard</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.push("/profile")}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Registering...</span>
                                        </div>
                                    ) : (
                                        "Register Restaurant"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center mt-6 text-sm text-gray-600">
                    <p>By registering your restaurant, you agree to our <a href="#"
                                                                           className="text-orange-600 hover:underline">Terms
                        of Service</a> and <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateRestaurant;