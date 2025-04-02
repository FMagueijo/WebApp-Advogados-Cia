import React from 'react';
import * as X from "@/components/xcomponents_skel";

const getRandomSpan = () => Math.floor(Math.random() * 2) + 1; // Random span between 1 and 2

const SimpleSkeleton: React.FC = () => {
    return (
        <X.Container
            className={`w-full h-full bg-gray-300/20 items-center justify-center text-gray-300`}
        ></X.Container>
    );
};

export default SimpleSkeleton;