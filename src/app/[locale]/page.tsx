import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";

export default async function Home() {
    return (
        <section className="relative h-[400px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"/>
            <img
                src="/bg.png"
                alt="Food background"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-white">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold">
                        Discover Amazing Food
                    </h1>
                    <p className="text-xl md:text-2xl">
                        Share your experiences and get personalized recommendations
                    </p>
                    <form className="flex items-center justify-center mt-4 bg-background w-full max-w-md mx-auto rounded-md shadow-lg">
                        <input
                            type="text"
                            placeholder="Search for food, restaurants..."
                            className="px-4 py-2 rounded-l-md text-black w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        <Button type="submit" size="icon" className="rounded-l-md">
                            <Search className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
