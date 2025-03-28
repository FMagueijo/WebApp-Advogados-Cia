"use client"

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import * as X from "@/components/xcomponents";
import { signOut, useSession } from "next-auth/react";

const ROLES = {
    ADMIN: 1,
    COLAB: 2,
} as const;

interface NavLink {
    href: string;
    label: string;
    roles?: number[];
}

interface UtilLink extends NavLink {
    ico: string;
    customColor?: string;
    onClick?: () => void;
}

const navLinks: NavLink[] = [
    { href: "/", label: "Inicio" },
    { href: "/casos", label: "Casos" },
    { href: "/clientes", label: "Clientes" },
    { href: "/colaboradores", label: "Colaboradores" },
    { href: "/agenda", label: "Agenda" },
];

export async function logout() {
    await signOut();
}

const utilLinks: UtilLink[] = [
    { href: "/perfil", label: "Perfil", ico: "/images/icons/profile.svg" },
    { href: "/notificacoes", label: "Notificações", ico: "/images/icons/notification.svg", roles: [ROLES.COLAB] },
    {
        href: "/logout", label: "Logout", ico: "/images/icons/logout.svg", customColor: "--error-color", onClick: logout
    },
];

const NO_NAV_BAR_PAGES = [
    "/_error",
    "/login",
    "/definir-password",
];

// Helper function to check if user has required role
const hasRequiredRole = (userRole: number | undefined, requiredRoles?: number[]) => {
    if (!requiredRoles) return true; // No role restriction
    if (!userRole) return false; // User not logged in
    return requiredRoles.includes(userRole);
};

const BurgerNav: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const pathname = usePathname();
    const { data: session } = useSession();

    const filteredNavLinks = navLinks.filter(link =>
        hasRequiredRole(session?.user?.role, link.roles)
    );

    const filteredUtilLinks = utilLinks.filter(link =>
        hasRequiredRole(session?.user?.role, link.roles)
    );

    return (
        <div className="flex flex-col gap-8 w-full content-start items-start">
            <X.Button onClick={toggleMobileMenu} className="w-max">
                <div className="flex flex-row gap-4 h-max">
                    <img src="/images/brand/logo.svg" className="h-6" />
                    <img src={isMobileMenuOpen ? "/images/icons/close.svg" : "/images/icons/menu.svg"} className="h-6 self-r" />
                </div>
            </X.Button>
            <X.Container direction="horizontal" className={`items-start justify-start w-full ${isMobileMenuOpen ? "" : "hidden"} overflow-x-auto overflow-y-hidden`}>
                {filteredNavLinks.map((link) => (
                    <X.ButtonLink
                        key={link.href}
                        selected={pathname === link.href}
                        href={link.href}
                        className="w-max">
                        {link.label}
                    </X.ButtonLink>
                ))}
            </X.Container>
            <X.Container direction="horizontal" className={`items-start justify-start w-full ${isMobileMenuOpen ? "" : "hidden"}`}>
                {filteredUtilLinks.map((link) => (
                    <X.ButtonLink
                        key={link.href}
                        selected={pathname === link.href}
                        href={link.onClick ? undefined : link.href}
                        smallpadding={true}
                        onClick={link.onClick}
                        custombg={link.customColor ? link.customColor : ""}
                        className="flex-shrink-0 group">
                        <img className={"min-w-6 flex-shrink-0" + (pathname === link.href ? " invert" : "")} src={link.ico} />
                    </X.ButtonLink>
                ))}
            </X.Container>
        </div>
    );
}

interface NavProps {
    className?: string;
}

const Navbar: React.FC<NavProps> = ({ className = "" }) => {
    const pathname = usePathname();
    const { data: session } = useSession();

    if (NO_NAV_BAR_PAGES.includes(pathname)) {
        return null;
    }

    const filteredNavLinks = navLinks.filter(link =>
        hasRequiredRole(session?.user?.role, link.roles)
    );

    const filteredUtilLinks = utilLinks.filter(link =>
        hasRequiredRole(session?.user?.role, link.roles)
    );

    return (
        <div className={`${className} sticky w-full p-8 top-0 bg-(--background-color)/90 backdrop-blur-sm z-50 -mt-8`}>
            <nav>
                <ul className="flex flex-row gap-8 overflow-hidden">
                    <li className="flex flex-col w-full xl:hidden justify-center items-center gap-8">
                        <BurgerNav></BurgerNav>
                    </li>
                    <li className={`hidden xl:block w-lg`}>
                        <X.Container className="h-full w-full">
                            <img src="/images/brand/logo.svg" className="h-full w-full" loading="lazy" />
                        </X.Container>
                    </li>
                    <li className={`flex-grow overflow-x-auto hidden xl:block w-full`}>
                        <X.Container direction="horizontal" className="justify-start overflow-x-auto overflow-y">
                            {filteredNavLinks.map((link) => (
                                <X.ButtonLink
                                    key={link.href}
                                    selected={pathname === link.href}
                                    href={link.href}
                                    className="w-max flex-shrink-0">
                                    {link.label}
                                </X.ButtonLink>
                            ))}
                        </X.Container>
                    </li>
                    <li className={`hidden xl:block`}>
                        <X.Container direction="horizontal" className="h-full justify-center overflow-x-auto overflow-y-hidden">
                            {filteredUtilLinks.map((link) => (
                                <X.ButtonLink
                                    key={link.href}
                                    selected={pathname === link.href}
                                    href={link.onClick ? undefined : link.href}
                                    smallpadding={true}
                                    onClick={link.onClick}
                                    custombg={link.customColor ? link.customColor : ""}
                                    className="flex-shrink-0 group">
                                    <img className={"min-w-6 flex-shrink-0" + (pathname === link.href ? " invert" : "")} src={link.ico} />
                                </X.ButtonLink>
                            ))}
                        </X.Container>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export { Navbar };