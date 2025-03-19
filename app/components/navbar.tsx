import React from "react";
import * as X from "../components/xcomponents";


interface NavProps {
    className?: string;
}
const Navbar: React.FC<NavProps> = ({ className = "" }) => {
    return (
        <div className={`${className} sticky top-0 p-8 mb-[-32px] bg-(--background-color)/95 backdrop-blur-md z-50`}>
            <nav>
                <ul className="flex flex space-x-8">
                    <li>
                        <X.Container className="h-full"> 
                            <img src="/images/brand/logo.svg" className="h-full" />
                        </X.Container>
                    </li>
                    <li className="flex-grow">
                        <X.Container direction="horizontal" className="flex justify-start">
                            <X.ButtonLink selected={true} href="https://www.google.com" className="flex-shrink-0">Inicio</X.ButtonLink>
                            <X.ButtonLink selected={false} href="https://www.google.com" className="flex-shrink-0">Casos</X.ButtonLink>
                            <X.ButtonLink selected={false} href="https://www.google.com" className="flex-shrink-0">Clientes</X.ButtonLink>
                            <X.ButtonLink selected={false} href="https://www.google.com" className="flex-shrink-0">Colaboradores</X.ButtonLink>
                            <X.ButtonLink selected={false} href="https://www.google.com" className="flex-shrink-0">Agenda</X.ButtonLink>
                        </X.Container>
                    </li>
                    <li>
                        <X.Container direction="horizontal" className="h-full">
                            <X.ButtonLink href="https://www.google.com" smallpadding={true}><img className="min-w-6" src="/images/icons/profile.svg" /></X.ButtonLink>
                            <X.ButtonLink href="https://www.google.com" smallpadding={true}><img className="min-w-6" src="/images/icons/notification.svg" /></X.ButtonLink>
                            <X.ButtonLink custombg="var(--error-color)" href="https://www.google.com" smallpadding={true}><img className="min-w-6" src="/images/icons/logout.svg" /></X.ButtonLink>
                        </X.Container>
                    </li>
                </ul>
            </nav>
        </div>
    );
};



export {Navbar};