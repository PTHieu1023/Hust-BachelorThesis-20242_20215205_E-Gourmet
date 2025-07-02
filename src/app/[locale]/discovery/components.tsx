/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {MapPin, Search, Star} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import * as React from "react";
import {ChangeEventHandler, useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {cn} from "@/lib/utils";
import {useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Link} from "@/i18n/navigation";
import {Cuisine, getCuisines} from "@/services/cuisine.service";
import {ShortDishProps} from "@/services/dish.service";

interface FilterProps {
    search?: string;
    cuisine?: string;
    priceRange?: [number, number];
    maxPrice?: number
}

export const DiscoveryFilter = () => {
    const [cuisines, setCuisines] = useState<Cuisine[]>([]);
    useEffect(() => {
        getCuisines().then(fetchCuisines => setCuisines(fetchCuisines));
    }, []);

    const t = useTranslations("discovery.filter");
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize filters from URL query params
    const initialSearch = searchParams.get("search") ?? undefined;
    const initialCuisine = searchParams.get("cuisine") ?? undefined;

    const [filters, setFilters] = useState<FilterProps>({
        search: initialSearch,
        cuisine: initialCuisine,
    });

    const onClickSearch = () => {
        const params: Record<string, any> = {};
        if (filters.search) params.search = filters.search;
        if (filters.cuisine && filters.cuisine !== "all") params.cuisine = filters.cuisine;
        router.replace(`/discovery?${new URLSearchParams(params).toString()}`);
    }

    return (
        <Card className="border-gray-100 mb-6">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-orange-500"/>
                    <span>{t("title")}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 grid grid-cols-10 gap-4 justify-center items-start">
                <SearchFilter
                    className={"col-span-7"}
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}/>
                <div className="flex gap-4 col-span-3">
                    <CuisineFilter
                        cuisines={cuisines}
                        selected={filters.cuisine}
                        onValueChange={(value) => setFilters({...filters, cuisine: value || "all"})}
                    />
                    <Button
                        className={"bg-orange-500 hover:bg-orange-600 rounded-xl"}
                        onClick={onClickSearch}
                    >
                        <Search className="w-4 h-4"/>
                        {t("search")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

interface SearchFilterProps {
    className?: string,
    value?: string,
    onChange?: ChangeEventHandler<HTMLInputElement>
}

const SearchFilter = ({className, value, onChange}: SearchFilterProps) => {
    const t = useTranslations("discovery.filter");
    return (
        <div className={cn("w-full justify-center items-center", className)}>
            <Input
                placeholder={t("search-placeholder")}
                value={value ?? ""}
                onChange={onChange}
                className="w-full"
            />
        </div>
    );
}

interface CuisineFilterProps {
    cuisines: Cuisine[];
    selected?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

function CuisineFilter({cuisines, selected, onValueChange, className}: Readonly<CuisineFilterProps>) {
    const t = useTranslations("discovery.filter");
    return (
        <div className={cn("w-full justify-center items-center", className)}>
            <Select value={selected} onValueChange={onValueChange}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder={t("cuisines")}/>
                </SelectTrigger>
                <SelectContent>
                    {cuisines.map((cuisine) => (
                        <SelectItem key={cuisine.id} value={`${cuisine.id}`}>{cuisine.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export const FoodCard = ({dish}:{dish: ShortDishProps}) => {
    console.log(dish)
    return (
        <Link key={dish.id} href={`/restaurant/1/${dish.id}`}>
            <Card className="border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                    <Image
                        // src={dish.images?.[0] ?? "/logo.svg"}
                        src={"/logo.svg"}
                        alt={dish.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                        width={32} height={32}
                    />
                </div>

                <CardContent className="p-4">
                    <span className={"flex items-center justify-between"}>
                        <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
                        <Badge variant="outline">{dish.cuisine}</Badge>
                    </span>
                    <h4>{dish.price}</h4>

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-gray-400"/>
                            <span className="text-sm text-gray-600">{dish.restaurant}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                            <span className="text-sm font-medium">{dish.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}