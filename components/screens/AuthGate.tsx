
import React, { useState } from 'react';
import LandingScreen from './LandingScreen.tsx';
import AuthScreen from './AuthScreen.tsx';

const AuthGate: React.FC = () => {
    const [showLanding, setShowLanding] = useState(true);

    if (showLanding) {
        return <LandingScreen onGetStarted={() => setShowLanding(false)} />;
    }

    return <AuthScreen />;
};

export default AuthGate;