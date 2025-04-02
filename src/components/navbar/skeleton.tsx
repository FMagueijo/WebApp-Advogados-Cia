import React from 'react';
import * as X from "@/components/xcomponents_skel";

interface NavbarProps {
    // Define any props for the Navbar component here
    title?: string;
}

const Skeleton: React.FC<NavbarProps> = ({ title = 'Default Title' }) => {
    return (
        <div className={`sticky w-full p-8 top-0  backdrop-blur-sm z-50 -mt-8 animate-pulse`}>
            <nav>
                <ul className="flex flex-row gap-8 overflow-hidden">
                    {/* Mobile Burger Menu - Replaced with skeleton ToggleBox */}
                    <li className="flex flex-col w-full xl:hidden justify-start items-center gap-8">
                        <X.ButtonLink className="w-36 h-9 flex-shrink-0 self-start" />

                    </li>

                    {/* Logo - Using skeleton Container and Image */}
                    <li className="hidden xl:block w-lg">
                        <X.Container className="h-max w-full" direction="horizontal" >
                            <X.ButtonLink className="w-full h-12 flex-shrink-0" />

                        </X.Container>
                    </li>

                    {/* Main Nav Links - Using skeleton ButtonLink components */}
                    <li className="flex-grow overflow-x-auto hidden xl:block w-full">
                        <X.Container direction="horizontal" className="justify-start overflow-x-auto overflow-y-hidden gap- flex-row">
                            {[...Array(5)].map((_, i) => (
                                <X.ButtonLink key={i} className="w-24 h-12 flex-shrink-0" />
                            ))}
                        </X.Container>
                    </li>

                    {/* Utility Links - Using skeleton Button components */}
                    <li className="hidden xl:block">
                        <X.Container direction="horizontal" className="h-full justify-center gap-4">
                            {[...Array(3)].map((_, i) => (
                                <X.Button key={i} className="w-14 h-12 flex" />
                            ))}
                        </X.Container>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Skeleton;
