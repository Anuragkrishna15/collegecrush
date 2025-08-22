
import React, { useState } from 'react';
import { PREMIUM_GRADIENT } from '../../constants.tsx';
import { Screen } from '../../types.ts';
import { X } from 'lucide-react';

interface AdBannerProps {
    setActiveScreen: (screen: Screen) => void;
}

const AdBanner: React.FC<AdBannerProps> = ({ setActiveScreen }) => {
    const [visible, setVisible] = useState(true);

    if (!visible) {
        return null;
    }
    
    const handleUpgradeClick = () => {
        setActiveScreen(Screen.Profile);
    };

    return (
        <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between gap-4 mb-4 animate-fade-in">
            <div className="flex-1">
                <p className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${PREMIUM_GRADIENT}`}>
                    Go Premium for Unlimited Swipes!
                </p>
                <p className="text-xs text-neutral-400">Unlock all features now.</p>
            </div>
            <div className="flex items-center gap-2">
                 <button 
                    onClick={handleUpgradeClick}
                    className="text-white bg-pink-600 hover:bg-pink-700 transition-colors text-xs font-semibold px-3 py-1.5 rounded-md"
                >
                    Upgrade
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); setVisible(false); }}
                    className="text-neutral-500 hover:text-white transition-colors"
                    aria-label="Close ad banner"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default AdBanner;