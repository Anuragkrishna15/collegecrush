
import * as React from 'react';

interface StickyHeaderProps {
    title: string;
    subtitle: string;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="sticky top-0 left-0 right-0 z-30 bg-neutral-950/80 backdrop-blur-lg p-4 pb-4 border-b border-neutral-800/50">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-neutral-400 mt-1 text-sm">{subtitle}</p>
        </div>
    );
};

export default StickyHeader;