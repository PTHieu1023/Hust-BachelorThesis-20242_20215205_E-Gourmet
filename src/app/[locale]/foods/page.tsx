"use client"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import FoodList from "@/components/food/FoodList";
import {useState} from "react";


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

                {/*<TabsContent value="recommended">*/}
                {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">*/}
                {/*        {data?.sampleRecommendations.map((rec) => {*/}
                {/*            const food = data?.sampleFoods.find((f) => f.id === rec.foodId);*/}
                {/*            if (!food) return null;*/}

                {/*            return (*/}
                {/*                <Card key={rec.foodId}>*/}
                {/*                    <CardHeader>*/}
                {/*                        <CardTitle className="flex items-center justify-between">*/}
                {/*                            <span>Recommended for you</span>*/}
                {/*                            <span className="text-sm text-muted-foreground">*/}
                {/*                                {Math.round(rec.score * 100)}% match*/}
                {/*                            </span>*/}
                {/*                        </CardTitle>*/}
                {/*                    </CardHeader>*/}
                {/*                    <CardContent>*/}
                {/*                        <div className="space-y-4">*/}
                {/*                            <div className="flex items-center space-x-2">*/}
                {/*                                <Star className="w-4 h-4 text-yellow-400 fill-current" />*/}
                {/*                                <span className="text-sm">{food.rating.toFixed(1)}</span>*/}
                {/*                                <span className="text-sm text-muted-foreground">*/}
                {/*                                    ({food.reviewCount} reviews)*/}
                {/*                                </span>*/}
                {/*                            </div>*/}
                {/*                            <ul className="space-y-2">*/}
                {/*                                {rec.reasons.map((reason, index) => (*/}
                {/*                                    <li key={index} className="text-sm text-muted-foreground">*/}
                {/*                                        • {reason}*/}
                {/*                                    </li>*/}
                {/*                                ))}*/}
                {/*                            </ul>*/}
                {/*                        </div>*/}
                {/*                    </CardContent>*/}
                {/*                </Card>*/}
                {/*            );*/}
                {/*        })}*/}
                {/*    </div>*/}
                {/*</TabsContent>*/}
            </Tabs>
        </div>
    );
}
