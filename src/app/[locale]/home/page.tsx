"use client";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import {signIn} from "next-auth/react";
import Image from "next/image";
import {useTranslations} from "next-intl";

export default function HomePage() {
    const t = useTranslations("home");
    return (
        <div className="container mx-auto px-4 text-center bg-gradient-to-b space-y-12 my-48">
            <Image src={"/logo.svg"} alt={t("logoAlt")} width={64} height={64} className="mx-auto mb-4"/>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                <span>{t("discoverYour")}</span>
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {" "}{t("favoriteDish")}
                </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button
                    size="lg"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6"
                    onClick={() => signIn("keycloak", {callbackUrl: "/"})}
                >
                    {t("startExploring")}
                    <ArrowRight className="w-5 h-5 ml-2"/>
                </Button>
            </div>
        </div>
    );
};
