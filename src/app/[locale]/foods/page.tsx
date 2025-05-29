"use client"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import FoodList from "@/components/food/FoodList";
import {useState} from "react";
import RecommendList from "@/components/food/RecommendList";


export default function FoodPage() {
    const [activeTab, setActiveTab] = useState<string>();

    return (
        <div className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="all">All Foods</TabsTrigger>
                    <TabsTrigger value="recommended">Recommended</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <FoodList/>
                </TabsContent>

                <TabsContent value="recommended">
                    <RecommendList/>
                </TabsContent>
            </Tabs>
        </div>
    );
}
