import {Star} from "lucide-react";
import {cn} from "@/lib/utils";

const RatingStar = ({rating, className}: { rating: number, className?: string }) => {
    return (
        <span className={cn("flex gap-1", className)}>
        {[...Array(5)].map((_, i) => (
            <Star key={"rating-star-" + i}
                  className={`w-5 h-5 ${
                      i < Math.floor(rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                  }`}
            />))
        }
        </span>)
}

export {RatingStar};