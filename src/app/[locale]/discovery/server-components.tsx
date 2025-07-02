/* eslint-disable @typescript-eslint/no-explicit-any */
import {getDish} from "@/services/dish.service";
import * as React from "react";
import {FoodCard} from "@/app/[locale]/discovery/components";

export const ItemList = async (
    {searchParams, t}: { searchParams: Promise<Record<string, string | string[] | number | number[]>>, t: any }) => {
    const dishes = await getDish(await searchParams);
    if (dishes.length === 0) {
        return <div>{t('no-results')}</div>;
    }
    return dishes.map(dish => <FoodCard dish={dish} key={dish.id}/>)
}