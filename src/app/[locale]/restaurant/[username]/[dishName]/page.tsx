"use client";
import ReviewModal from "@/components/ReviewModal";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {Heart, Star, MapPin, Clock, Phone, ArrowLeft, Share2, Edit, Minus, Plus} from "lucide-react";
import {useState} from "react";
import {useParams} from "next/navigation";
import {Link} from "@/i18n/navigation";

const DishDetail = () => {
    const {id} = useParams();
    const [isLiked, setIsLiked] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // Mock dish data - in a real app this would be fetched based on the ID
    const dish = {
        id: id || "1",
        name: "Truffle Carbonara",
        restaurant: "Bella Nonna Ristorante",
        restaurantId: "1",
        price: "$28",
        originalPrice: "$32",
        rating: 4.8,
        reviewCount: 127,
        cuisine: "Italian",
        prepTime: "25 mins",
        difficulty: "Medium",
        servingSize: "1 person",
        calories: 650,
        description: "Our signature truffle carbonara features house-made pasta tossed in a rich cream sauce with Italian black truffles, crispy pancetta, and aged Parmigiano-Reggiano. This indulgent dish represents the perfect marriage of traditional Roman cooking techniques with premium ingredients sourced directly from Italy.",
        images: [
            "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800",
            "https://images.unsplash.com/photo-1573225342350-16731dd9bf3d?w=800",
            "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800"
        ],
        ingredients: [
            "Fresh house-made fettuccine pasta",
            "Italian black truffles (Tuber melanosporum)",
            "Pancetta from Umbria",
            "Aged Parmigiano-Reggiano (24 months)",
            "Farm-fresh eggs",
            "Heavy cream",
            "White wine",
            "Fresh black pepper",
            "Sea salt"
        ],
        nutritionalInfo: {
            calories: 650,
            protein: "28g",
            carbs: "45g",
            fat: "42g",
            fiber: "3g",
            sodium: "890mg"
        },
        allergens: ["Gluten", "Dairy", "Eggs"],
        preparationMethod: [
            "Cook fresh pasta in salted boiling water until al dente",
            "Render pancetta until crispy and golden",
            "Create carbonara sauce with eggs, cream, and cheese",
            "Toss hot pasta with sauce and pancetta",
            "Finish with fresh truffle shavings and black pepper"
        ],
        customizations: [
            {name: "Extra Truffle", price: "+$8"},
            {name: "Gluten-Free Pasta", price: "+$3"},
            {name: "Extra Pancetta", price: "+$4"},
            {name: "Vegan Option", price: "+$2"}
        ],
        availability: "Available",
        estimatedDelivery: "35-45 mins"
    };

    // Mock restaurant data
    const restaurantData = {
        id: dish.restaurantId,
        name: dish.restaurant,
        address: "123 Main Street, San Francisco, CA",
        phone: "(555) 123-4567",
        hours: "Mon-Sun: 5:00 PM - 10:00 PM",
        rating: 4.8,
        reviewCount: 247,
        avatar: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400"
    };

    // Mock related dishes
    const relatedDishes = [
        {
            id: "2",
            name: "Margherita Pizza",
            price: "$22",
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
            rating: 4.7
        },
        {
            id: "3",
            name: "Osso Buco",
            price: "$34",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
            rating: 4.9
        },
        {
            id: "4",
            name: "Tiramisu",
            price: "$12",
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
            rating: 4.6
        }
    ];

    // Mock reviews
    const reviews = [
        {
            id: "1",
            author: "Sarah Chen",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b812b6ab?w=400",
            rating: 5,
            comment: "Absolutely incredible! The truffle aroma was divine and the pasta was perfectly al dente. Worth every penny!",
            date: "2024-01-15",
            helpful: 24
        },
        {
            id: "2",
            author: "Marco Rodriguez",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
            rating: 4,
            comment: "Rich and flavorful, though quite heavy. The truffle quality is exceptional. Great for special occasions.",
            date: "2024-01-12",
            helpful: 18
        }
    ];

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: dish.name,
                text: `Check out this amazing ${dish.name} from ${dish.restaurant}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const handleOpenReviewModal = () => {
        setIsReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/discovery">Discovery</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/restaurant/${dish.restaurantId}`}>{dish.restaurant}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{dish.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="mb-6 hover:bg-orange-50"
            >
                <ArrowLeft className="w-4 h-4 mr-2"/>
                Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <img
                            src={dish.images[selectedImage]}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLike}
                            className={`absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 ${
                                isLiked ? "text-red-500" : "text-gray-600"
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}/>
                        </Button>
                    </div>

                    {/* Image Thumbnails */}
                    <div className="flex space-x-2">
                        {dish.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                    selectedImage === index ? "border-orange-500" : "border-gray-200"
                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`${dish.name} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dish Information */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">{dish.name}</h1>
                            <Button variant="ghost" size="icon" onClick={handleShare}>
                                <Share2 className="w-5 h-5"/>
                            </Button>
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-1">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400"/>
                                <span className="text-lg font-semibold">{dish.rating}</span>
                                <span className="text-gray-600">({dish.reviewCount} reviews)</span>
                            </div>
                            <Badge variant="outline">{dish.cuisine}</Badge>
                            <Badge className="bg-green-100 text-green-700">{dish.availability}</Badge>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4"/>
                                <span>{dish.prepTime}</span>
                            </div>
                            <span>•</span>
                            <span>{dish.difficulty}</span>
                            <span>•</span>
                            <span>{dish.servingSize}</span>
                            <span>•</span>
                            <span>{dish.calories} cal</span>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-6">{dish.description}</p>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl font-bold text-orange-600">{dish.price}</span>
                                {dish.originalPrice && (
                                    <span className="text-lg text-gray-500 line-through">{dish.originalPrice}</span>
                                )}
                            </div>

                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-600">Quantity:</span>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4"/>
                                    </Button>
                                    <span className="w-8 text-center font-medium">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= 10}
                                    >
                                        <Plus className="w-4 h-4"/>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Add Review Button */}
                        <Button
                            onClick={handleOpenReviewModal}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6"
                        >
                            <Edit className="w-5 h-5 mr-2"/>
                            Write a Review
                        </Button>

                        <p className="text-sm text-gray-600 text-center">
                            Share your experience with this dish
                        </p>
                    </div>
                </div>
            </div>

            {/* Restaurant Info */}
            <Card className="border-gray-100 mb-8">
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={restaurantData.avatar} alt={restaurantData.name}/>
                            <AvatarFallback>{restaurantData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <Link href={`/restaurant/${restaurantData.id}`}>
                                <h3 className="text-xl font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                                    {restaurantData.name}
                                </h3>
                            </Link>

                            <div className="flex items-center space-x-1 mb-2">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                                <span className="text-sm font-medium">{restaurantData.rating}</span>
                                <span className="text-sm text-gray-500">({restaurantData.reviewCount} reviews)</span>
                            </div>

                            <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4"/>
                                    <span>{restaurantData.address}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4"/>
                                    <span>{restaurantData.hours}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4"/>
                                    <span>{restaurantData.phone}</span>
                                </div>
                            </div>
                        </div>

                        <Link href={`/restaurant/${restaurantData.id}`}>
                            <Button variant="outline">
                                View Restaurant
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Ingredients */}
                <Card className="border-gray-100">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
                        <ul className="space-y-2">
                            {dish.ingredients.map((ingredient, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    {ingredient}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Nutritional Information */}
                <Card className="border-gray-100">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Facts</h3>
                        <div className="space-y-3">
                            {Object.entries(dish.nutritionalInfo).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="text-gray-600 capitalize">{key}:</span>
                                    <span className="font-medium text-gray-900">{value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Allergens:</h4>
                            <div className="flex flex-wrap gap-1">
                                {dish.allergens.map((allergen) => (
                                    <Badge key={allergen} variant="outline" className="text-xs">
                                        {allergen}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Preparation Method */}
                <Card className="border-gray-100">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preparation</h3>
                        <ol className="space-y-3">
                            {dish.preparationMethod.map((step, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span
                        className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-medium flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </CardContent>
                </Card>
            </div>

            {/* Customization Options */}
            <Card className="border-gray-100 mb-8">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customization Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dish.customizations.map((option, index) => (
                            <div key={index}
                                 className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
                                <span className="text-sm text-gray-700">{option.name}</span>
                                <span className="text-sm font-medium text-orange-600">{option.price}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="border-gray-100 mb-8">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                        <Button
                            onClick={handleOpenReviewModal}
                            variant="outline"
                            size="sm"
                            className="hover:bg-orange-50 hover:border-orange-200"
                        >
                            <Edit className="w-4 h-4 mr-2"/>
                            Write Review
                        </Button>
                    </div>
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                                <div className="flex items-start space-x-4">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={review.avatar} alt={review.author}/>
                                        <AvatarFallback>{review.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-gray-900">{review.author}</h4>
                                            <div className="flex items-center space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < review.rating
                                                                ? "text-yellow-400 fill-yellow-400"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-2">{review.comment}</p>

                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>{review.date}</span>
                                            <span>{review.helpful} people found this helpful</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Related Dishes */}
            <Card className="border-gray-100">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">You Might Also Like</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedDishes.map((relatedDish) => (
                            <Link key={relatedDish.id} href={`/dish/${relatedDish.id}`}>
                                <div className="group cursor-pointer">
                                    <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                                        <img
                                            src={relatedDish.image}
                                            alt={relatedDish.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                                                {relatedDish.name}
                                            </h4>
                                            <span className="font-bold text-orange-600">{relatedDish.price}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                                            <span className="text-sm font-medium">{relatedDish.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={handleCloseReviewModal}
                dishName={dish.name}
                restaurantName={dish.restaurant}
            />
        </div>
    );
};

export default DishDetail;