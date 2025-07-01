/* eslint-disable @typescript-eslint/no-explicit-any */
import {getDish} from "@/services/dish.service";
import * as React from "react";
import {FoodCard} from "@/app/[locale]/discovery/components";

export const ItemList = async (
    {searchParams, t}: { searchParams: Promise<Record<string, string | string[] | number | number[]>>, t: any }) => {
    const raw = await searchParams;
    const search = Array.isArray(raw.search) ? String(raw.search[0]) : String(raw.search);
    const cuisineId = Number(Array.isArray(raw.cuisineId) ? raw.cuisineId[0] : raw.cuisineId ?? 0);
    const minPrice = Number(Array.isArray(raw.minPrice) ? raw.minPrice[0] : raw.minPrice ?? 0);
    const maxPrice = Number(Array.isArray(raw.maxPrice) ? raw.maxPrice[0] : raw.maxPrice ?? 9999999);
    const dishes = await getDish({search, cuisineId, minPrice, maxPrice});
    if (dishes.length === 0) {
        return <div>{t('no-results')}</div>;
    }
    return dishes.map(dish => <FoodCard dish={dish} key={dish.id}/>)
}