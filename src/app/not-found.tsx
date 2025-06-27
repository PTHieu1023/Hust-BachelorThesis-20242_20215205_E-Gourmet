"use client"

import Link from 'next/link';

export default function NotFound() {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-9xl font-bold text-gray-900">404</h1>
                        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
                        <p className="text-gray-500 mt-4">The page you're looking for doesn't exist or has been moved.</p>
                        <Link
                            href="/"
                            className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}