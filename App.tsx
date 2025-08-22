
import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import BottomNav from './components/BottomNav.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ProfileDetailModal from './components/modals/ProfileDetailModal.tsx';
import BookBlindDateModal from './components/modals/BookBlindDateModal.tsx';
import VibeCheckModal from './components/modals/VibeCheckModal.tsx';
import OnboardingScreen from './components/screens/OnboardingScreen.tsx';
import AuthGate from './components/screens/AuthGate.tsx';
import TopBar from './components/common/TopBar.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

import { Screen, Profile, BlindDate, User, AppNotification, Conversation } from './types.ts';
import { UserContext } from './hooks/useUser.ts';
import { ThemeProvider } from './hooks/useTheme.ts';
import { NotificationContext, notificationHandler } from './hooks/useNotification.ts';
import { getProfile, getUnreadNotificationsCount, markAllNotificationsAsRead, getConversationDetails, markNotificationAsRead } from './services/api.ts';
import { supabase } from './services/supabase.ts';
import SwipeScreen from './components/screens/SwipeScreen.tsx';

// Statically import screens to resolve a potential issue with lazy loading in the current environment.
import DatesScreen from './components/screens/DatesScreen.tsx';
import ChatScreen from './components/screens/ChatScreen.tsx';
import TripsScreen from './components/screens/TripsScreen.tsx';
import EventsScreen from './components/screens/EventsScreen.tsx';
import ProfileScreen from './components/screens/ProfileScreen.tsx';
import SettingsScreen from './components/screens/SettingsScreen.tsx';
import EditProfileScreen from './components/screens/EditProfileScreen.tsx';
import LikesScreen from './components/screens/LikesScreen.tsx';
import NotificationsScreen from './components/screens/NotificationsScreen.tsx';


const App: React.FC = () => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [boostEndTime, setBoostEndTime] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [activeScreen, setActiveScreenState] = useState<Screen>(Screen.Swipe);
  const [unreadCount, setUnreadCount] = useState(0);

  // Modal States
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isBookingDate, setIsBookingDate] = useState(false);
  const [vibeCheckDate, setVibeCheckDate] = useState<BlindDate | null>(null);
  
  // Lifted state for chat navigation
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const notificationContextValue = useMemo(() => ({ showNotification: notificationHandler }), []);

  const logout = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setBoostEndTime(undefined);
    setActiveScreenState(Screen.Swipe);
    setActiveConversation(null);
    setProfileError(null);
    setUnreadCount(0);
    setLoading(false);
  }, []);

  const refetchUser = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      setProfileError(null);
      const profile = await getProfile(session.user.id);
      setUser(profile);
      setBoostEndTime(profile?.boost_end_time);
    } catch (error: any) {
      console.error("Error refetching profile:", error.message || error);
      setUser(null);
      setProfileError("We couldn't load your profile. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  const setActiveScreen = (screen: Screen) => {
    // Reset active conversation when navigating away from the chat screen
    if (activeScreen === Screen.Chat && screen !== Screen.Chat) {
      setActiveConversation(null);
    }
    setActiveScreenState(screen);
  };
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (_event === 'SIGNED_OUT') {
            setUser(null);
            setProfileError(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      refetchUser();
      
      getUnreadNotificationsCount(session.user.id).then(setUnreadCount);

      const channel = supabase.channel(`notifications-for-${session.user.id}`)
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${session.user.id}`
        }, (payload: any) => {
            const newNotification = payload.new;
            if (newNotification && 'message' in newNotification) {
                notificationHandler((newNotification as AppNotification).message, 'info');
                setUnreadCount(prev => prev + 1);
            }
        })
        .subscribe();
      
      return () => {
          supabase.removeChannel(channel);
      };
    } else {
      setLoading(false);
      setUnreadCount(0);
    }
  }, [session, refetchUser]);
  
  const contextValue = useMemo(() => ({ user, loading, logout, refetchUser, boostEndTime }), [user, loading, logout, refetchUser, boostEndTime]);

  const handleGoToChat = (conversation?: Conversation) => {
    setActiveConversation(conversation || null);
    setActiveScreen(Screen.Chat);
  };
  
  const handleProfileUpdate = useCallback(async () => {
      await refetchUser();
      setActiveScreen(Screen.Profile);
  }, [refetchUser]);

  const handleMarkAllAsRead = async () => {
    if (!user || unreadCount === 0) return;
    try {
        await markAllNotificationsAsRead(user.id);
        setUnreadCount(0);
    } catch (error: any) {
        console.error("Error marking notifications as read:", error.message || error);
        notificationHandler("Could not mark notifications as read.", "error");
    }
  };

  const handleNotificationClick = async (notification: AppNotification) => {
      if (!user) return;
  
      setLoading(true);
      const wasUnread = !notification.is_read;

      try {
           if (notification.source_entity_id) {
                switch (notification.type) {
                    case 'new_message':
                    case 'new_match':
                    case 'vibe_check_match': {
                        const convo = await getConversationDetails(notification.source_entity_id, user.id);
                        if (convo) {
                            setActiveConversation(convo);
                            setActiveScreen(Screen.Chat);
                        } else {
                            throw new Error("Could not load the conversation.");
                        }
                        break;
                    }
                    case 'new_blind_date_request':
                    case 'blind_date_accepted':
                        setActiveScreen(Screen.Dates);
                        break;
                    default:
                        // For notifications without a direct link, do nothing.
                        break;
                }
           }
          
          if (wasUnread) {
            await markNotificationAsRead(notification.id);
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
      } catch (error: any) {
          notificationHandler(error.message || "Could not open notification.", "error");
      } finally {
          setLoading(false);
      }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case Screen.Swipe:
        return <SwipeScreen onProfileClick={setSelectedProfile} onGoToChat={handleGoToChat} setActiveScreen={setActiveScreen} />;
      case Screen.Likes:
        return <LikesScreen onProfileClick={setSelectedProfile} setActiveScreen={setActiveScreen} />;
      case Screen.Dates:
        return <DatesScreen onBookDate={() => setIsBookingDate(true)} onVibeCheck={setVibeCheckDate} setActiveScreen={setActiveScreen} />;
      case Screen.Chat:
        return <ChatScreen 
                    onProfileClick={setSelectedProfile} 
                    activeConversation={activeConversation}
                    setActiveConversation={setActiveConversation}
                />;
      case Screen.Trips:
        return <TripsScreen />;
      case Screen.Events:
        return <EventsScreen />;
      case Screen.Profile:
        return <ProfileScreen setActiveScreen={setActiveScreen} />;
      case Screen.Settings:
        return <SettingsScreen setActiveScreen={setActiveScreen} />;
      case Screen.EditProfile:
        return <EditProfileScreen onProfileUpdate={handleProfileUpdate} />;
      case Screen.Notifications:
        return <NotificationsScreen onMarkAllAsRead={handleMarkAllAsRead} onNotificationClick={handleNotificationClick} />;
      default:
        return <SwipeScreen onProfileClick={setSelectedProfile} onGoToChat={handleGoToChat} setActiveScreen={setActiveScreen} />;
    }
  };
  
  const AppContent = () => {
    if (loading) {
       return (
        <div className="bg-transparent min-h-screen flex items-center justify-center">
            <LoadingSpinner />
        </div>
       );
    }
    if (!session) {
        return <AuthGate />;
    }

    if (profileError) {
        return (
            <div className="bg-transparent min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl font-bold text-red-500">An Error Occurred</h2>
                <p className="text-zinc-400 mt-2">{profileError}</p>
                <button onClick={refetchUser} className="mt-6 px-6 py-2 bg-pink-600 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                    Retry
                </button>
                <button onClick={logout} className="mt-4 text-sm text-zinc-500 hover:text-white transition-colors">
                    Log Out
                </button>
            </div>
        );
    }
    
    // This now correctly identifies ONLY new users
    if (!user) {
        return <OnboardingScreen onProfileCreated={refetchUser} />;
    }
    
    // HACK: Cast motion components to `any` to bypass framer-motion/react-19 type issues.
    // This is a temporary workaround for a known issue between these libraries. It can be removed once
    // framer-motion releases an official version with full React 19 compatibility.
    const MotionDiv = motion.div as any;

    return (
        <div className="md:flex h-screen w-full bg-transparent font-sans">
          <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
          <main className="flex-1 h-full flex flex-col bg-zinc-950 md:bg-zinc-950/50 md:backdrop-blur-lg md:rounded-l-3xl md:border-l md:border-zinc-800 relative">
             <TopBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} unreadCount={unreadCount} />
             <div className="flex-1 overflow-y-auto pb-24 md:pb-0">
                <AnimatePresence mode="wait">
                    <MotionDiv
                        key={activeScreen}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-full w-full"
                    >
                        <Suspense fallback={
                           <div className="h-full w-full flex items-center justify-center">
                                <LoadingSpinner />
                           </div>
                        }>
                            {renderScreen()}
                        </Suspense>
                    </MotionDiv>
                </AnimatePresence>
             </div>
          </main>
        </div>
    );
  }

  return (
    <ThemeProvider>
      <UserContext.Provider value={contextValue}>
      <NotificationContext.Provider value={notificationContextValue}>
        <Toaster 
          position="top-center"
          toastOptions={{
            className: '',
            style: {
              margin: '40px',
              background: '#27272a',
              color: '#fff',
              border: '1px solid #3f3f46',
            },
          }}
        />

        {selectedProfile && <ProfileDetailModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />}
        {isBookingDate && user && user.latitude && user.longitude && <BookBlindDateModal onClose={() => setIsBookingDate(false)} userLocation={{ latitude: user.latitude, longitude: user.longitude }} />}
        {vibeCheckDate && user && <VibeCheckModal date={vibeCheckDate} onClose={() => setVibeCheckDate(null)} />}

        <ErrorBoundary>
            <AppContent />
        </ErrorBoundary>

      </NotificationContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>
  );
};

export default App;