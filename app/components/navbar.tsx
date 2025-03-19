import React, { useState } from "react";
import * as X from "../components/xcomponents";


interface NavProps {
    className?: string;
}const Navbar: React.FC<NavProps> = ({ className = "" }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className={`${className} sticky top-0 p-8 mb-[-32px] bg-(--background-color)/95 backdrop-blur-md z-50`}>
            <nav>
                <ul className="flex 2xl:flex-row flex-col gap-8 overflow-hidden">
                    <li className="flex flex-col w-full lg:hidden justify-center items-center gap-8">
                        <X.Container direction="vertical" className="items-start justify-start w-full" overflow>
                            <X.Button onClick={toggleMobileMenu} className="w-max">
                                <div className="flex flex-row gap-4 h-max">
                                    <img src="/images/brand/logo.svg" className="h-6 " />
                                    <img src={isMobileMenuOpen ? "/images/icons/close.svg" : "/images/icons/menu.svg"} className="h-6 self-r" />
                                </div>
                            </X.Button>
                            <div
                                className={`flex flex-row items-start justify-start gap-4 overflow-x-auto no-scrollbar w-full ${isMobileMenuOpen ? "" : "hidden"}
                                    }`}
                            >
                                <X.ButtonLink selected={true} href="https://www.google.com" className="w-max flex-shrink-0">Inicio</X.ButtonLink>
                                <X.ButtonLink selected={false} href="https://www.google.com" className="w-max flex-shrink-0">Casos</X.ButtonLink>
                                <X.ButtonLink selected={false} href="https://www.google.com" className="w-max flex-shrink-0">Clientes</X.ButtonLink>
                                <X.ButtonLink selected={false} href="https://www.google.com" className="w-max flex-shrink-0">Colaboradores</X.ButtonLink>
                                <X.ButtonLink selected={false} href="https://www.google.com" className="w-max flex-shrink-0">Agenda</X.ButtonLink>
                            </div>
                            <div
                                className={`flex flex-row items-start justify-start gap-4 overflow-x-auto no-scrollbar w-full ${isMobileMenuOpen ? "" : "hidden"}`}
                            >
                                <X.ButtonLink href="https://www.google.com" className="w-max flex-shrink-0" smallpadding={true}><img className="min-w-6 flex-shrink-0" src="/images/icons/profile.svg" /></X.ButtonLink>
                                <X.ButtonLink href="https://www.google.com" className="w-max flex-shrink-0" smallpadding={true}><img className="min-w-6 flex-shrink-0" src="/images/icons/notification.svg" /></X.ButtonLink>
                                <X.ButtonLink custombg="var(--error-color)" className="w-max flex-shrink-0" href="/login" smallpadding={true}><img className="min-w-6" src="/images/icons/logout.svg" /></X.ButtonLink>
                            </div>

                        </X.Container>



                    </li>
                    <li className={` hidden lg:block`}>
                        <X.Container className="h-full w-max">
                            <img src="/images/brand/logo.svg" className="h-full w-max" />
                        </X.Container>
                    </li>
                    <li className={`flex-grow hidden lg:block w-full`}>
                        <X.Container direction="horizontal" className="justify-start" overflow>
                            <X.ButtonLink selected={true} href="https://www.google.com" className="flex-shrink-0">Inicio</X.ButtonLink>
                            <X.ButtonLink selected={false} href="https://www.google.com" className="flex-shrink-0">Casos</X.ButtonLink>
                            <X.ButtonLink selected={false} href="https://www.google.com" className="flex-shrink-0">Clientes</X.ButtonLink>
                            <X.ButtonLink selected={false} href="https://www.google.com" className="flex-shrink-0">Colaboradores</X.ButtonLink>
                            <X.ButtonLink selected={false} href="https://www.google.com" className="flex-shrink-0">Agenda</X.ButtonLink>
                        </X.Container>
                    </li>
                    <li className={` hidden lg:block`}>
                        <X.Container direction="horizontal" className="justify-center" overflow>
                            <X.ButtonLink className="flex-shrink-0" href="https://www.google.com" smallpadding={true}><img className="min-w-6 flex-shrink-0" src="/images/icons/profile.svg" /></X.ButtonLink>
                            <X.ButtonLink className="flex-shrink-0" href="https://www.google.com" smallpadding={true}><img className="min-w-6 flex-shrink-0" src="/images/icons/notification.svg" /></X.ButtonLink>
                            <X.ButtonLink className="flex-shrink-0" custombg="var(--error-color)" href="/login" smallpadding={true}><img className="min-w-6" src="/images/icons/logout.svg" /></X.ButtonLink>
                        </X.Container>
                    </li>
                </ul>
            </nav>
        </div>
    );
};


export { Navbar };