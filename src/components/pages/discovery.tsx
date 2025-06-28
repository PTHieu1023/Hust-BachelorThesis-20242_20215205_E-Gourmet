"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {MapPin, Search, Star} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ChangeEventHandler, Suspense, useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import * as React from "react";
import {Slider} from "@/components/ui/slider";
import {cn} from "@/lib/utils";
import {useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Link} from "@/i18n/navigation";

interface FilterProps {
    search?: string;
    cuisineId?: number;
    priceRange?: [number, number];
    maxPrice?: number
}

export const DiscoveryFilter = () => {
    const max = 9999999; // TODO: Replace with dynamic max price from API or config
    const cuisines = ["All", "Italian", "Japanese", "Mexican", "Chinese", "American", "Thai", "Indian", "French"]; // API or config based list of cuisines

    const t = useTranslations("discovery.filter");
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize filters from URL query params
    const initialSearch = searchParams.get("search") || "";
    const initialCuisineId = Number(searchParams.get("cuisineId")) || 0;
    const initialMinPrice = Number(searchParams.get("minPrice")) || 0;
    const initialMaxPrice = Number(searchParams.get("maxPrice")) || max;

    const [filters, setFilters] = useState<FilterProps>({
        search: initialSearch,
        cuisineId: initialCuisineId,
        priceRange: [initialMinPrice, initialMaxPrice],
        maxPrice: max
    });

    // Debounce filter changes
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 400);
        return () => clearTimeout(handler);
    }, [filters]);

    // Update URL query params when debounced filters change
    React.useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedFilters.search) params.set("search", debouncedFilters.search);
        if (debouncedFilters.cuisineId !== undefined) params.set("cuisineId", String(debouncedFilters.cuisineId));
        if (debouncedFilters.priceRange) {
            params.set("minPrice", String(debouncedFilters.priceRange[0]));
            params.set("maxPrice", String(debouncedFilters.priceRange[1]));
        }
        router.replace(`?${params.toString()}`);
    }, [debouncedFilters, router]);


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
                        cuisineId={filters.cuisineId}
                        onValueChange={(value) => setFilters({...filters, cuisineId: Number(value) || 0})}
                    />
                    <PriceRangeFilter
                        priceRange={filters.priceRange}
                        max={max}
                        step={5000}
                        onValueChange={value => setFilters({...filters, priceRange: value})}/>
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
            <span className="flex items-center space-x-2">{t("search")}</span>
            < Input
                placeholder="Search dishes or restaurants..."
                value={value}
                onChange={onChange}
                className="w-full"
            />
        </div>
    );
}

interface CuisineFilterProps {
    cuisines: string[];
    cuisineId?: number;
    onValueChange?: (value: string) => void;
    className?: string;
}

function CuisineFilter({cuisines, cuisineId = 0, onValueChange, className}: CuisineFilterProps) {
    const t = useTranslations("discovery.filter");
    return (
        <div className={cn("w-full justify-center items-center", className)}>
            <span className="flex items-center space-x-2">{t("cuisines")}</span>
            <Select value={`${cuisineId}`} onValueChange={onValueChange}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder={t("cuisines")}/>
                </SelectTrigger>
                <SelectContent>
                    {cuisines.map((cuisine, index) => (
                        <SelectItem key={cuisine} value={`${index}`}>{cuisine}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

interface PriceRangeFilterProps {
    className?: string;
    max: number;
    priceRange?: [number, number];
    step?: number;
    onValueChange?: (value: [number, number]) => void;
}

const PriceRangeFilter = (
    {className, max, priceRange, onValueChange, step = 1}: PriceRangeFilterProps) => {
    const t = useTranslations("discovery.filter");

    return (
        <div className={cn("w-full justify-center items-center", className)}>
            <span className="flex items-center space-x-2">{t("price-range")}</span>
            <div className="w-full flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">0</span>
                <Slider value={priceRange} onValueChange={onValueChange} max={max} step={step}/>
                <span className="text-sm text-muted-foreground">{max}</span>
            </div>
            <p className="mt-2 text-center text-sm text-muted-foreground">
                {priceRange ? priceRange[0] : 0} - {priceRange ? priceRange[1] : max}
            </p>
        </div>
    );
}

export const FoodCard = ({dish}:{dish: any}) => {
    return (
        <Link key={dish.id} href={`/restaurant/1/${dish.id}`}>
            <Card className="border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                    <Image
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                        width={32} height={32}
                    />
                    <Badge className="absolute top-2 right-2 bg-white text-gray-800">
                        {dish.price}
                    </Badge>
                </div>

                <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dish.description}</p>

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-gray-400"/>
                            <span className="text-sm text-gray-600">{dish.restaurant}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                            <span className="text-sm font-medium">{dish.rating}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Badge variant="outline">{dish.cuisine}</Badge>
                        <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            View Details
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}