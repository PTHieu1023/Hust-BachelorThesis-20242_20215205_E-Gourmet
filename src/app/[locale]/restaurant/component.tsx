/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {Camera, Edit, Eye, MoreHorizontal, Plus, Trash2, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {FormEvent, useEffect, useRef, useState} from "react";
import {Restaurant} from "@/services/restaurant.service";
import {useTranslations} from "next-intl";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {createDish, CreateDishParams, deleteDish, ShortDishProps} from "@/services/dish.service";
import EditRestaurantModal from "@/components/modal/EditRestaurantModal";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import Image from "next/image";
import {uploadFile} from "@/services/upload.service";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Cuisine, getCuisines} from "@/services/cuisine.service";
import {Link, useRouter} from "@/i18n/navigation";

export function EditRestaurantButton({restaurant}: { restaurant: Restaurant }) {
    const t = useTranslations("restaurant");
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    return (
        <>
            <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => setIsEditModalOpen(true)}
            >
                <Edit className="w-4 h-4 mr-2"/>
                {t('edit-profile')}
            </Button>
            <EditRestaurantModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                restaurant={restaurant}
            />
        </>
    );
}

export function AddDishButton({restaurantId}: { restaurantId: number }) {
    const [isAddDishModalOpen, setIsAddDishModalOpen] = useState<boolean>(false);

    return (
        <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setIsAddDishModalOpen(true)}
        >
            <Plus className="w-4 h-4 mr-2"/>
            Add Dish
            <AddDishModal isOpen={isAddDishModalOpen} onCloseAction={() => {setIsAddDishModalOpen(false)}} restaurantId={restaurantId}/>
        </Button>
    );
}

export function MenuItemController({dish}: { dish: ShortDishProps }) {
    const t = useTranslations("restaurant.menu-item");
    const router = useRouter();

    const onDeleteDish = () => {
        deleteDish(dish.id).then(() => {
            toast.success("Dish deleted successfully!");
            router.refresh()
        }).catch(e => toast.error(e));
    };

    return (<DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href={`/restaurant/${dish.restaurantId}/${dish.id}`} className="flex items-center">
                        <Eye className="w-4 h-4 mr-2"/>
                        {t('view')}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2"/>
                    {t('edit')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600"
                    onClick={onDeleteDish}
                >
                    <Trash2 className="w-4 h-4 mr-2"/>
                    {t('delete')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface AddDishModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    restaurantId: number;
}

export const AddDishModal = ({isOpen, onCloseAction, restaurantId}: AddDishModalProps) => {
    const [formData, setFormData] = useState<CreateDishParams>({
        restaurantId: restaurantId,
        name: "",
        description: "",
        price: 0,
        cuisineId: 0
    });
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [cuisines, setCuisines] = useState<Cuisine[]>([]);
    const router = useRouter();

    useEffect(() => {
        getCuisines().then((data) => {
            setCuisines(data);
        }).catch((err: Error) => toast.error("Failed to load cuisines. Please try again later.", {description: err.message}));
    }, [])

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleImageUpload = (e:  any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        uploadFile(file).then((data) => {
            const mockImageUrl = data.url; // Replace with actual URL from upload service
            setUploadedImages(prev => [...prev, mockImageUrl]);
        }).catch(() => {
            toast.error("Image upload failed. Please try again.");
        }).finally()
    };
    const handleRemoveImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.description || !formData.price) {
            toast.error("Please enter your information!");
            return;
        }
        createDish(formData).then(() => {
            toast.success("Dish added successfully!");
            setFormData({
                restaurantId: restaurantId,
                name: "",
                description: "",
                price: 0,
                cuisineId: 0
            });
            setUploadedImages([]);
            onCloseAction();
            router.refresh();
        }).catch(() => {
            toast.error("Failed to create dish.");
        })
    };

    const handleClose = () => {
        setFormData({
            restaurantId: restaurantId,
            name: "",
            description: "",
            price: 0,
            cuisineId: 0
        });
        setUploadedImages([]);
        onCloseAction();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Add New Dish to Menu</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Dish Name *</Label>
                            <Input
                                id="name"
                                placeholder="Enter dish name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cuisine">Cuisine *</Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, cuisineId: parseInt(value) })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select cusine" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cuisines.map((cuisine) => (
                                        <SelectItem key={cuisine.id} value={`${cuisine.id}`}>
                                            {cuisine.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <Input
                            id="price"
                            placeholder="VND"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value)})}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your dish, ingredients, and what makes it special..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Dish Photos</Label>

                        {uploadedImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                {uploadedImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <Image
                                            src={image}
                                            alt={`Image ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                            width={900}
                                            height={900}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Input type={"file"} hidden={true} onChange={handleImageUpload} ref={fileInputRef}/>

                        <Button
                            type="button"
                            variant={"outline"}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-orange-300 transition-colors"
                        >
                            <Camera className="w-8 h-8 text-gray-400 mb-2"/>
                            <span className="text-sm text-gray-600">Add Photo ({uploadedImages.length}/5)</span>
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-orange-500 hover:bg-orange-600"
                        >
                            Add Dish to Menu
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};