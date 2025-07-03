"use client"

import {Edit, Eye, MoreHorizontal, Plus, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Restaurant} from "@/services/restaurant.service";
import {useTranslations} from "next-intl";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ShortDishProps} from "@/services/dish.service";
import EditRestaurantModal from "@/components/modal/EditRestaurantModal";

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

export function AddDishButton({restaurant}: { restaurant: Restaurant }) {
    const t = useTranslations("restaurant");
    const [isAddDishModalOpen, setIsAddDishModalOpen] = useState<boolean>(false);

    return (
        <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setIsAddDishModalOpen(true)}
        >
            <Plus className="w-4 h-4 mr-2"/>
            Add Dish
        </Button>
    );
}

export function MenuItemController({dish}: { dish: ShortDishProps }) {
    const t = useTranslations("restaurant.menu-item");

    const deleteDish = () => {
        // Implement the delete functionality here
        console.log(`Deleting dish with ID: ${dish.id}`);
    };

    return (<DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2"/>
                    {t('view')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2"/>
                    {t('edit')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600"
                    onClick={deleteDish}
                >
                    <Trash2 className="w-4 h-4 mr-2"/>
                    {t('delete')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
