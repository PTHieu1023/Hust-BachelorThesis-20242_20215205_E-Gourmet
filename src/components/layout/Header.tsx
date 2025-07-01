"use client";

import {Compass, ForkKnife, Heart, Home, LogOut, User,  PcCase} from "lucide-react";
import {signIn, signOut, useSession} from "next-auth/react";
import {KCSession} from "@/configs/auth.config";
import {useLocale, useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Link, usePathname} from "@/i18n/navigation";
import {clearSession} from "@/services/auth.service";
import {ReactNode, useEffect} from "react";
import {clsx} from "clsx";

export default function Header() {
    const t = useTranslations("header");
    const {status} = useSession();
    const pathname = usePathname();
    const locale = useLocale();

    return (
        <header
            className="px-12 mx-auto flex items-center justify-between bg-background border-b border-gray-100 py-2 shadow-sm dark:border-gray-700">
            <Link href={"/"} className="flex items-center space-x-2">
                <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white">
                    <ForkKnife className="size-5"/>
                </span>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    E-Gourmet
                </span>
            </Link>
            <div className="flex items-center space-x-4">
                <nav className={`items-center space-x-4 ${status === "authenticated" ? "flex" : "hidden"}`}>
                    <NavButton
                        href="/"
                        label={t("navbar.newsfeed")}
                        icon={<Home className="w-4 h-4"/>}
                    />
                    <NavButton
                        href="/discovery"
                        label={t("navbar.discovery")}
                        icon={<Compass className="w-4 h-4"/>}
                    />
                    <NavButton
                        href="/for-you"
                        label={t("navbar.for-you")}
                        icon={<Heart className="w-4 h-4"/>}
                    />
                </nav>
                <UserMenu/>
                <span className="flex items-center space-x-2">
                    <Link href={pathname} locale={"vi"} className={`text-2xl px-1 align-middle rounded h-max ${locale === "vi" ? "bg-muted-foreground" : "hover:bg-muted"}`}>
                        🇻🇳
                    </Link>
                    <Link href={pathname} locale={"en"} className={`text-2xl px-1 align-middle rounded h-max ${locale === "en" ? "bg-muted-foreground" : "hover:bg-muted"}`}>
                        🇺🇸
                    </Link>
                </span>
            </div>
        </header>
    );
};

function NavButton({href, label, icon}: Readonly<{ href: string; label: string; icon: ReactNode }>) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href + "/") || pathname === href
    return (
        <Link href={href} className={clsx("h-full flex items-center space-x-2 py-2 px-4 rounded-lg", {
            "bg-orange-500 hover:bg-orange-600 text-white": isActive,
            "text-foreground hover:bg-orange-100": !isActive
        })
        }>
            {icon}
            <span>{label}</span>
        </Link>
    );
}

function UserMenu() {
    const {data, status} = useSession();
    const session = data as KCSession;
    const user = session?.user;
    const t = useTranslations("header.user-menu");

    const logout = () => clearSession(session?.id_token).then(() => signOut({callbackUrl: "/home"}));


    useEffect(() => {
        if(session?.error){
            logout().then()
        }
    }, [session]);

    if (status !== "authenticated" || !user)
        return (
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => signIn("keycloak", {callbackUrl: "/"})}>
                {t("sign-in")}
            </Button>
        )
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={user.imageUrl ?? `https://ui-avatars.com/api/?name=${user.name}`}/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 text-foreground">
                <DropdownMenuLabel>@{user?.username}</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/profile`} className="flex items-center">
                        <User className="mr-2 h-4 w-4"/>
                        <span>{user.name}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={"/restaurant"} className="flex items-center" >
                        <PcCase className={"mr-2 h-4 w-4"}/>
                        <span>{t("restaurant")}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={"hover:bg-red-400 hover:text-white"}
                    onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    <span>{t("logout")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}