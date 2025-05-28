'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/themeController';
import useAuth from '@/hooks/useAuth';
import Image from "next/image";

export default function Navbar() {
    const pathname = usePathname();
    const { user, status, login, logout } = useAuth();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="border-b">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-xl font-bold">
                            <Image src={"/logo.svg"} alt={"E-Gourmet"} width={36} height={36}/>
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            <Link
                                href="/foods"
                                className={`text-sm font-medium transition-colors hover:text-muted-foreground ${
                                    isActive('/foods') ? 'text-muted-foreground' : "text-primary"
                                }`}
                            >
                                Foods
                            </Link>
                            <Link
                                href="/restaurants"
                                className={`text-sm font-medium transition-colors hover:text-muted-foreground ${
                                    isActive('/foods') ? 'text-muted-foreground' : "text-primary"
                                }`}
                            >
                                Restaurants
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        {status === 'authenticated' ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/profile">
                                    <Button variant="ghost" size="sm">
                                        {user?.name}
                                    </Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={logout}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Button size="sm" onClick={login}>
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
} 