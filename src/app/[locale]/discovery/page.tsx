import {Suspense} from "react";
import * as React from "react";
import {DiscoveryFilter, FoodCard} from "@/components/pages/discovery";;
import {getDish} from "@/services/dish.service";

export default async function DiscoveryPage({searchParams}: { searchParams: Promise<Record<string, any>> }) {
    return (
        <div className="container mx-auto px-4 py-6">
            <DiscoveryFilter/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Suspense fallback={"..."}>
                    <ItemList searchParams={await searchParams}/>
                </Suspense>
            </div>
        </div>
    );
};


const ItemList = async ({searchParams}: { searchParams: Record<string, any> }) => {
    const {search = "", cuisineId = 0, minPrice = 0, maxPrice = 9999999} = searchParams;
    const dishes = await getDish({search, cuisineId, minPrice, maxPrice});
    return dishes.map(dish => <FoodCard dish={dish} key={dish.id}/>)
}