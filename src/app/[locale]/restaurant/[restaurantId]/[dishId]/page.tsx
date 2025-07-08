import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Star, Home} from "lucide-react";
import {Link} from "@/i18n/navigation";
import CommonBreadcrumb, {BreadcrumbItemProps} from "@/components/layout/CommonBreadcrumb";
import {setRequestLocale} from "next-intl/server";
import {getDishDetails} from "@/services/dish.service";
import {ImageView, ReviewSection} from "@/app/[locale]/restaurant/[restaurantId]/[dishId]/components";
import {getReviews} from "@/services/review.service";
import {BackButton} from "@/components/common";

interface PageProps {
    params: Promise<{
        locale: string;
        restaurantId: string;
        dishId: number;
    }>;
}

export default async function DetailDishPage({params}: Readonly<PageProps>) {
    const {locale, restaurantId, dishId} = await params;
    setRequestLocale(locale);
    const dish = await getDishDetails(dishId);
    const reviews = await getReviews({dishId: dishId});

    const breadCrumbs: BreadcrumbItemProps[] = [
        {
            href: '/',
            label: <Home className={"size-3"}/>
        },
        {
            href: `/restaurant/${restaurantId}`,
            label: dish?.restaurant
        },
        {
            href: `/restaurant/${restaurantId}/${dishId}`,
            label: dish?.name
        }
    ]

    return (
        <div className="container mx-auto px-4 py-6">
            <CommonBreadcrumb items={breadCrumbs}/>
            <BackButton/>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ImageView images={[dish.images?? "/logo.svg"]}/>
                <div className="space-y-2">
                    <Link href={`/restaurant/${dish?.restaurantId}`} className="flex items-center space-x-4">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={dish.restaurantAvatar} alt={dish.restaurant}/>
                            <AvatarFallback>{dish.restaurant.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                            {dish.restaurant}
                        </h3>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">{dish.name}</h1>
                    <span className="text-2xl font-bold text-orange-600">${dish.price}</span>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400"/>
                            <span className="text-lg font-semibold">{dish.rating}</span>
                            <span className="text-gray-600">({dish.reviewCount} reviews)</span>
                        </div>
                        <Badge variant="outline">{dish.cuisine}</Badge>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">{dish.description}</p>
                </div>
            </div>

            <ReviewSection dish={dish} reviews={reviews}/>
        </div>
    );
};
