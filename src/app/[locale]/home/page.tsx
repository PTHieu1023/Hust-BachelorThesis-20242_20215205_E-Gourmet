"use client";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import {signIn} from "next-auth/react";

export default function HomePage() {
    return (
        <div className="container mx-auto px-4 text-center bg-gradient-to-b space-y-12 my-48">
            {/*<div className="max-w-4xl mx-auto space-y-8">*/}
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                    <span>Discover Your Next</span>
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                {" "}Favorite Dish
                            </span>
                </h1>

                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Connect with fellow food enthusiasts, discover amazing restaurants, and share your culinary
                    adventures.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <Button
                        size="lg"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6"
                        onClick={() => signIn("keycloak", {callbackUrl: "/"})}
                    >
                        Start Exploring
                        <ArrowRight className="w-5 h-5 ml-2"/>
                    </Button>
                </div>
            {/*</div>*/}
        </div>
    );
};
