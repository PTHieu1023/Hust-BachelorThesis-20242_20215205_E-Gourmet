"use client"
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {useTranslations} from "next-intl";

export const BackButton = () => {
    const t = useTranslations("common");
    return (
        <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6 hover:bg-orange-50"
        >
            <ArrowLeft className="w-4 h-4 mr-2"/>
            {t('back')}
        </Button>
    )
}