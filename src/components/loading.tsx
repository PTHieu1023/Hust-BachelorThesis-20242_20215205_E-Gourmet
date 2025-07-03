import {Loader2} from "lucide-react";

export default function Loading() {
    return (
        <div className={"flex items-center justify-center h-fit text-orange-500"}>
            <Loader2 className={"animate-spin w-16 h-16"}/>
        </div>
    );
}