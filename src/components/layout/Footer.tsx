import {ForkKnife} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <ForkKnife className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">E-Gourmet</span>
                </div>

                <p className="text-gray-400 mb-6">
                    The food review social network where you can share your culinary experiences, discover new dishes, and connect with fellow food lovers.
                </p>

                <p className="text-gray-500 text-sm">
                    &copy; 2025 E-Gourmet by <a href={"https://github.com/PTHieu1023"} className={"font-bold hover:text-blue-400 underline"}>@hiusnef</a>
                </p>
            </div>
        </footer>
    );
} 