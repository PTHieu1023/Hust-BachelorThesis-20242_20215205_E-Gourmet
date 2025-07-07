"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {FormEvent, useState} from "react";
import {Clock, Phone, Mail, Building2} from "lucide-react";
import {toast} from "sonner";
import {useRouter} from "@/i18n/navigation";
import {useTranslations} from "next-intl";
import {createRestaurant, CreateRestaurantParams} from "@/services/restaurant.service";

const CreateRestaurant = () => {
    const t = useTranslations("restaurant.register");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()
    const [formData, setFormData] = useState<CreateRestaurantParams>({
        name: "",
        address: "",
        phone: "",
        email: "",
        openHour: "",
        website: "",
        description: "",
        documents: [],
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        createRestaurant(formData).then(() => {
            toast.success("Restaurant registered successfully.")
            router.push("/restaurant");
        }).catch(() => {
            toast.error("Error submitting");
        }).finally(() => {
            setIsSubmitting(false)
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div
                        className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-white"/>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
                    <p className="text-gray-600">{t("subtitle")}</p>
                </div>

                <Card className="border-gray-100">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Building2 className="w-5 h-5 text-orange-500"/>
                            <span>{t("restaurantInfo")}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="name">{t("restaurantName")} <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        placeholder={t("restaurantNamePlaceholder")}
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">{t("address")} <span className="text-red-500">*</span></Label>
                                <Input
                                    id="address"
                                    placeholder={t("addressPlaceholder")}
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">{t("phone")} <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Phone
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                        <Input
                                            id="phone"
                                            placeholder={t("phonePlaceholder")}
                                            className="pl-10"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">{t("email")} <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                        <Input
                                            id="email"
                                            placeholder={t("emailPlaceholder")}
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
                                    <Label htmlFor="hours">{t("hours")}</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 text-gray-400 w-4 h-4"/>
                                        <Input
                                            id="hours"
                                            placeholder={t("hoursPlaceholder")}
                                            className="pl-10"
                                            value={formData.openHour}
                                            onChange={(e) => handleInputChange("openHour", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">{t("website")}</Label>
                                    <Input
                                        id="website"
                                        placeholder={t("websitePlaceholder")}
                                        value={formData.website}
                                        onChange={(e) => handleInputChange("website", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">{t("description")}</Label>
                                <Textarea
                                    id="description"
                                    placeholder={t("descriptionPlaceholder")}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.push("/restaurant")}
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
            </div>
        </div>
    );
};

export default CreateRestaurant;