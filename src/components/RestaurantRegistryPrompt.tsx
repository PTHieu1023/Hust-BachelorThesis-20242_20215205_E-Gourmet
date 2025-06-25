import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Star, Users } from "lucide-react";
import {Link} from "@/i18n/navigation";
import {cn} from "@/lib/utils";

export default function RestaurantRegistryPrompt({...props}) {
    return (
        <Card className={ cn("border-orange-200 bg-gradient-to-br from-orange-50 to-red-50", props.className)}>
            <CardContent className="p-6">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Own a Restaurant?
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Join E-Gourmet as a business and connect with food lovers in your area
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-orange-500" />
                            <span>Reach new customers</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-orange-500" />
                            <span>Showcase your dishes</span>
                        </div>
                    </div>

                    <Link href="/restaurant/register">
                        <Button className="w-full bg-orange-500 hover:bg-orange-600">
                            <Plus className="w-4 h-4 mr-2" />
                            Register Your Restaurant
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};