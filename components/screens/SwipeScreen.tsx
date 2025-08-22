import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { fetchProfiles, recordSwipe, fetchAds } from '../../services/api.ts';
import { Profile, MembershipType, Screen, Ad, Swipeable } from '../../types.ts';
import ProfileCard from '../ProfileCard.tsx';
import AdCard from '../AdCard.tsx';
import MatchPopup from '../MatchPopup.tsx';
import { useUser } from '../../hooks/useUser.ts';
import LoadingSpinner from '../LoadingSpinner.tsx';
import EmptyState from '../common/EmptyState.tsx';
import { useNotification } from '../../hooks/useNotification.ts';
import { X, Heart, Users, AlertTriangle, RefreshCw } from 'lucide-react';

const SWIPE_LIMIT = 5;

const MotionButton = motion.button as any;
const MotionDiv = motion.div as any;

interface SwipeButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    ariaLabel: string;
    disabled?: boolean;
}

function SwipeButton({ children, onClick, className, ariaLabel, disabled }: SwipeButtonProps) {
    return (
        <MotionButton
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={`w-24 h-24 flex items-center justify-center rounded-full bg-zinc-900/50 backdrop-blur-md border border-white/10 shadow-2xl transition-colors disabled:opacity-50 ${className}`}
        >
            {children}
        </MotionButton>
    );
}

interface SwipeScreenProps {
    onProfileClick: (profile: Profile) => void;
    onGoToChat: () => void;
    setActiveScreen: (screen: Screen) => void;
}

const getTodaysSwipeData = () => {
    try {
        const item = window.localStorage.getItem('swipeData');
        if (item) {
            const { date, count } = JSON.parse(item);
            const today = new Date().toISOString().split('T')[0];
            if (date === today) {
                return { count: Number(count) || 0 };
            }
        }
    } catch (error) {
        // Silently fail, default will be returned
    }
    // If no data, or data is from a previous day, reset.
    return { count: 0 };
};


function SwipeScreen({ onProfileClick, onGoToChat, setActiveScreen }: SwipeScreenProps) {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [ads, setAds] = useState<Ad[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showMatchPopup, setShowMatchPopup] = useState(false);
    const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
    const [swipesToday, setSwipesToday] = useState(getTodaysSwipeData().count);
    const { user } = useUser();
    const { showNotification } = useNotification();

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const likeOpacity = useTransform(x, [20, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

    const swipeDeck = useMemo((): Swipeable[] => {
        if (!user || user.membership !== MembershipType.Free || ads.length === 0 || profiles.length === 0) {
            return profiles;
        }
        const interleaved: Swipeable[] = [];
        let adIndex = 0;
        for (let i = 0; i < profiles.length; i++) {
            interleaved.push(profiles[i]);
            // After every profile, show an ad
            interleaved.push(ads[adIndex % ads.length]);
            adIndex++;
        }
        return interleaved;
    }, [profiles, ads, user]);

    const loadData = useCallback(() => {
        if (user) {
            setLoading(true);
            setError(null);
            setCurrentIndex(0); // Reset index on new data load
            Promise.all([
                fetchProfiles(user.id, user.gender),
                user.membership === MembershipType.Free ? fetchAds() : Promise.resolve([] as Ad[])
            ])
            .then(([fetchedProfiles, fetchedAds]) => {
                setProfiles(fetchedProfiles);
                setAds(fetchedAds);
            })
            .catch(error => {
                setError("Could not load cards. Please check your connection and try again.");
            })
            .finally(() => setLoading(false));
        }
    }, [user]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const advanceProfile = useCallback(() => {
        x.set(0);
        setCurrentIndex(prevIndex => prevIndex + 1);
    }, [x]);

    const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
        if (!user || currentIndex >= swipeDeck.length) return;

        const swipedItem = swipeDeck[currentIndex];
        
        // Type guard to check if it's a profile
        if (!('link' in swipedItem)) {
            const swipedUser = swipedItem as Profile;

            if (user.membership === MembershipType.Free && swipesToday >= SWIPE_LIMIT) {
                showNotification("Daily swipe limit reached. Upgrade for more!", 'error');
                return;
            }
            
            advanceProfile();

            try {
                const result = await recordSwipe(user.id, swipedUser.id, direction);
                if (direction === 'right') {
                    if (result && result.match_created) {
                        setMatchedProfile(swipedUser);
                        setShowMatchPopup(true);
                        showNotification(`You matched with ${swipedUser.name}!`, 'success');
                    }
                }
                const newSwipeCount = swipesToday + 1;
                setSwipesToday(newSwipeCount);
                if (user.membership === MembershipType.Free) {
                    const today = new Date().toISOString().split('T')[0];
                    window.localStorage.setItem('swipeData', JSON.stringify({ date: today, count: newSwipeCount }));
                }
            } catch (error) {
                showNotification("Something went wrong, please try again.", "error");
            }
        } else {
            // It's an ad, just advance
            advanceProfile();
        }
    }, [user, currentIndex, swipeDeck, swipesToday, showNotification, advanceProfile]);


    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
        if (info.offset.x > 100) {
            handleSwipe('right');
        } else if (info.offset.x < -100) {
            handleSwipe('left');
        }
    };
    
    const currentItem = !loading && !error && swipeDeck.length > 0 && currentIndex < swipeDeck.length ? swipeDeck[currentIndex] : null;
    const isCurrentItemAd = currentItem && 'link' in currentItem;
    const swipesLeft = user?.membership === MembershipType.Free ? SWIPE_LIMIT - swipesToday : Infinity;

    return (
        <div className="h-full flex flex-col p-4 md:p-6 overflow-hidden relative">
            
            {showMatchPopup && matchedProfile && <MatchPopup matchedProfile={matchedProfile} onClose={() => setShowMatchPopup(false)} onGoToChat={onGoToChat} />}
            
            <div className="flex-1 w-full relative flex items-center justify-center pt-2">
                {loading ? <LoadingSpinner /> : error ? (
                     <div className="text-center p-4">
                        <AlertTriangle size={48} className="mx-auto text-red-500" />
                        <p className="mt-4 text-zinc-300">{error}</p>
                        <button onClick={loadData} className="mt-4 px-4 py-2 bg-pink-600 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                            Retry
                        </button>
                    </div>
                ) : currentItem ? (
                    <div className="w-full h-full max-h-[700px] max-w-md relative">
                        {swipeDeck.slice(currentIndex, currentIndex + 2).reverse().map((item, index) => {
                           const isAd = 'link' in item;
                           if (!isAd && (!item.profilePics || item.profilePics.length === 0)) {
                                return null; // Defensive check for profiles
                           }
                           const isTopCard = index === (swipeDeck.slice(currentIndex, currentIndex + 2).length - 1);
                           const key = isAd ? `ad-${item.id}` : `profile-${item.id}`;

                            return (
                                <MotionDiv
                                    key={key}
                                    className="absolute w-full h-full"
                                    style={{ zIndex: index }}
                                    animate={{
                                        scale: isTopCard ? 1 : 0.95,
                                        y: isTopCard ? 0 : -25,
                                        opacity: isTopCard ? 1 : 0.8,
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    x={isTopCard ? x : 0}
                                    rotate={isTopCard ? rotate : 0}
                                    drag={isTopCard ? "x" : false}
                                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                    onDragEnd={isTopCard ? handleDragEnd : undefined}
                                >
                                    <div className="relative w-full h-full">
                                      {isAd ? (
                                        <AdCard ad={item} />
                                      ) : (
                                        <ProfileCard profile={item as Profile} onClick={() => onProfileClick(item as Profile)} />
                                      )}

                                       {isTopCard && !isAd && (
                                          <>
                                              <MotionDiv
                                                  style={{ opacity: likeOpacity }}
                                                  className="absolute top-12 left-8 transform -rotate-20 text-pink-400 font-extrabold text-7xl border-4 border-pink-400 p-2 rounded-xl pointer-events-none z-20 bg-black/30 backdrop-blur-md shadow-2xl shadow-pink-500/50"
                                              >
                                                  LIKE
                                              </MotionDiv>
                                              <MotionDiv
                                                  style={{ opacity: nopeOpacity }}
                                                  className="absolute top-12 right-8 transform rotate-20 text-red-500 font-extrabold text-7xl border-4 border-red-500 p-2 rounded-xl pointer-events-none z-20 bg-black/30 backdrop-blur-md shadow-2xl shadow-red-500/50"
                                              >
                                                  NOPE
                                              </MotionDiv>
                                          </>
                                       )}
                                    </div>
                                </MotionDiv>
                            )
                        })}
                    </div>
                ) : (
                    <EmptyState
                        icon={<Users size={64} />}
                        title="That's everyone for now!"
                        message="No new profiles match your preferences. Check back later or adjust your filters."
                     >
                        <button onClick={loadData} className="mt-6 flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg font-semibold hover:bg-zinc-700 transition-colors text-white">
                           <RefreshCw size={16} />
                           Refresh
                        </button>
                    </EmptyState>
                )}
            </div>
            
            <div className="flex flex-col items-center justify-center w-full pt-4 h-36">
                {user?.membership === MembershipType.Free && currentItem && !isCurrentItemAd && (
                    <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                        Swipes left today: <span className="font-bold text-black dark:text-white">{swipesLeft > 0 ? swipesLeft : 0}</span>
                    </div>
                )}

                {currentItem && !isCurrentItemAd && (
                    <div className="flex items-center justify-center space-x-6 md:space-x-8 w-full">
                        <SwipeButton onClick={() => handleSwipe('left')} ariaLabel="Swipe left (reject)" className="text-red-500">
                            <X size={40} strokeWidth={3} />
                        </SwipeButton>
                        <SwipeButton onClick={() => handleSwipe('right')} ariaLabel="Swipe right (like)" className="text-pink-500">
                            <Heart size={48} fill="currentColor" />
                        </SwipeButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SwipeScreen;