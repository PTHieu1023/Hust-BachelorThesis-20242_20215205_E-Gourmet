import {Star} from "lucide-react";

const RatingStar = ({rating}:{rating: number}) => {
    return [...Array(5)].map((_, i) => (
        <Star key={"rating-star-" + i}
            className={`w-5 h-5 ${
                i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
            }`}
        />
    ))
}

export {RatingStar};