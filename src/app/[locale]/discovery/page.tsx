import {Suspense} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {MapPin, Star} from "lucide-react";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {DiscoveryFilter} from "./components";
import {ShortDishProps, getDish, SearchDishFilterProps} from "@/services/dish.service";
import {getTranslations, setRequestLocale} from "next-intl/server";
import Loading from "@/components/loading";

const SimpleFoodCard = ({dish}: { dish: ShortDishProps }) => {
    if (!dish?.id || !dish?.name) {
        return null;
    }

    const imageUrl = (dish.images && dish.images.length > 0)
        ? dish.images[0]
        : "/logo.svg";

    return (
        <Link href={`/restaurant/${dish.restaurantUsername}/${dish.id}`}>
            <Card className="border-gray-100 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="relative">
                    <Image
                        src={imageUrl}
                        alt={dish.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                        width={400} height={300}
                    />
                </div>

                <CardContent className="p-4">
          <span className="flex items-center justify-between">
            <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
            <Badge variant="outline">{dish.cuisine || 'General'}</Badge>
          </span>
                    <h4 className="text-orange-500 font-medium">{dish.price}</h4>

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-gray-400"/>
                            <span className="text-sm text-gray-600">{dish.restaurant || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                            <span className="text-sm font-medium">{dish.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

interface DishListingProps {
    t: (key: string) => string;
    searchParam?: { search?: string; cuisine?: string };
}

const DishListing = async ({t, searchParam}: DishListingProps) => {
    const filterProp: SearchDishFilterProps = {
        search: searchParam?.search,
        cuisineId: searchParam?.cuisine ? parseInt(searchParam.cuisine, 10) : undefined,
        page: 1,
        size: 999999 // Fetching all dishes for simplicity, consider pagination for large datasets
    };
    const dishes = await getDish(filterProp);

    if (!dishes) {
        return (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-8">
                {t("no-results")}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish) => (
                <SimpleFoodCard key={dish.id} dish={dish}/>
            ))}
        </div>
    );
};

interface PageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ search?: string; cuisine?: string }>;
}

export default async function DiscoveryPage({params, searchParams}: PageProps) {
    const {locale} = await params;
    setRequestLocale(locale);
    const t = await getTranslations("discovery");

    return (
        <div className="container mx-auto px-4 py-6">
            <DiscoveryFilter/>
            <Suspense fallback={<Loading/>}>
                <DishListing t={t} searchParam={await searchParams}/>
            </Suspense>
        </div>
    )
}

