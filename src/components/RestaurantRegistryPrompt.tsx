import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
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

                    <Link href="/restaurant/register">
                        <Button className="w-max bg-orange-500 hover:bg-orange-600">
                            <Plus className="w-4 h-4 mr-2" />
                            Register Your Restaurant
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};