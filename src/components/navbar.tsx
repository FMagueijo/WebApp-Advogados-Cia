"use client"

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import * as X from "../components/xcomponents";
import "@/app/AppContext";

const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/casos", label: "Casos" },
    { href: "/clientes", label: "Clientes" },
    { href: "/colaboradores", label: "Colaboradores" },
    { href: "/agenda", label: "Agenda" },
];

const utilLinks = [
    { href: "/profile", label: "Perfil", ico: "/images/icons/profile.svg" },
    { href: "/notifications", label: "Notificações", ico: "/images/icons/notification.svg" },
    { href: "/logout", label: "Logout", ico: "/images/icons/logout.svg", customColor: "--error-color" },
];

const NO_NAV_BAR_PAGES = [
    "/_error",
    "/login",
    "/define-password",
];

const BurgerNav: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const pathname = usePathname();



    return (
        <div className="flex flex-col gap-8 w-full content-start items-start">
            <X.Button onClick={toggleMobileMenu} className="w-max">
                <div className="flex flex-row gap-4 h-max">
                    <img src="/images/brand/logo.svg" className="h-6 " />
                    <img src={isMobileMenuOpen ? "/images/icons/close.svg" : "/images/icons/menu.svg"} className="h-6 self-r" />
                </div>
            </X.Button>
            
            <X.Container direction="horizontal" className={`items-start justify-start w-full ${isMobileMenuOpen ? "" : "hidden"}`} overflow>
                {navLinks.map((link) => (
                    <X.ButtonLink
                        key={link.href}
                        selected={pathname === link.href}
                        href={link.href}
                        className="w-max">
                        {link.label}
                    </X.ButtonLink>
                ))}

            </X.Container>
            <X.Container direction="horizontal" className={`items-start justify-start w-full ${isMobileMenuOpen ? "" : "hidden"}`} overflow>
                {utilLinks.map((link) => (
                    <X.ButtonLink
                        key={link.href}
                        selected={pathname === link.href}
                        href={link.href}
                        smallpadding={true}
                        custombg={link.customColor ? link.customColor : ""}
                        className="flex-shrink-0">
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

    if (NO_NAV_BAR_PAGES.includes(pathname)) {
        return null; // Don't render the navbar
    }

    return (
        <div className={`${className} sticky w-full p-8 top-0 bg-(--background-color)/90 backdrop-blur-sm z-50 -mt-8`}>
            <nav>
                <ul className="flex flex-row gap-8 overflow-hidden ">
                    <li className="flex flex-col w-full xl:hidden justify-center items-center gap-8">
                        <BurgerNav></BurgerNav>
                    </li>
                    <li className={` hidden xl:block`}>
                        <X.Container className="h-full w-max">
                            <img src="/images/brand/logo.svg" className="h-full w-max" />
                        </X.Container>
                    </li>
                    <li className={`flex-grow overflow-x-auto hidden xl:block w-full`}>
                        <X.Container direction="horizontal" className="justify-start" overflow>
                            {navLinks.map((link) => (
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
                        <X.Container direction="horizontal" className="h-full justify-center" overflow>
                            {utilLinks.map((link) => (
                                <X.ButtonLink
                                    key={link.href}
                                    selected={pathname === link.href}
                                    href={link.href}
                                    smallpadding={true}
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