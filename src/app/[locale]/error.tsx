'use client'

import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";
import Image from "next/image";

interface Props {
    error: Error & { digest?: string }
    reset: () => void
}

export default function ErrorPage({error, reset}: Props) {
    const t = useTranslations("error");
    return (
        <div className={"text-4xl font-bold gap-4 flex justify-center items-center flex-col"}>
            <h2 className="text-center py-8 text-red-600">
                {t('title')}
            </h2>
            <p className={"text-xl font-medium text-gray-700"}>{error.message}</p>
            <Button className={"bg-orange-500 hover:bg-orange-600"} onClick={() => reset()}>
                Try again
            </Button>
        </div>
    )
}