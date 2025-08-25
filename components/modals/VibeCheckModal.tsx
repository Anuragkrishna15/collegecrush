
import * as React from 'react';
import { BlindDate, VibeCheck } from '../../types.ts';
import { submitVibeCheck } from '../../services/api.ts';
import { useNotification } from '../../hooks/useNotification.ts';
import { useUser } from '../../hooks/useUser.ts';
import { PREMIUM_GRADIENT } from '../../constants.tsx';
import LoadingSpinner from '../LoadingSpinner.tsx';
import { X, ThumbsUp, ThumbsDown, CheckCircle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VibeCheckModalProps {
    date: BlindDate;
    onClose: () => void;
}

const positiveTags = ['Funny', 'Great chat', 'Good Listener', 'Confident', 'Punctual', 'Respectful', 'Charming'];
const constructiveTags = ['A bit shy', 'Not very talkative', 'Seemed distracted', 'Arrogant', 'Late', 'Different vibe'];

const VibeCheckModal: React.FC<VibeCheckModalProps> = ({ date, onClose }) => {
    const [step, setStep] = React.useState<'rating' | 'tags' | 'submitted'>('rating');
    const [rating, setRating] = React.useState<'good' | 'bad' | null>(null);
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const { showNotification } = useNotification();
    const { user } = useUser();

    const handleRatingSelect = (selectedRating: 'good' | 'bad') => {
        setRating(selectedRating);
        setSelectedTags([]); // Reset tags when rating changes
        setStep('tags');
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async () => {
        if (!user || !rating) return;
        setLoading(true);
        const feedback: VibeCheck = { rating, tags: selectedTags };
        try {
            await submitVibeCheck(date.id, user.id, feedback);
            setStep('submitted');
        } catch (error) {
            showNotification('Failed to submit feedback.', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const relevantTags = rating === 'good' ? positiveTags : constructiveTags;

    const renderContent = () => {
        switch (step) {
            case 'rating':
                return (
                    <motion.div key="rating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                         <h2 className="text-2xl font-bold text-center">VibeCheck</h2>
                        <p className="text-zinc-400 mt-1 text-center">How was your date with {date.otherUser.name}?</p>
                        <div className="flex gap-4 mt-8">
                            <motion.button whileHover={{scale: 1.05}} whileTap={{ scale: 0.95 }} onClick={() => handleRatingSelect('good')} className="flex-1 flex flex-col items-center justify-center gap-2 p-6 bg-zinc-800 rounded-2xl border-2 border-transparent hover:border-green-500 transition-colors">
                                <ThumbsUp size={40} className="text-green-400"/>
                                <span className="text-xl font-semibold">Good Vibe</span>
                            </motion.button>
                             <motion.button whileHover={{scale: 1.05}} whileTap={{ scale: 0.95 }} onClick={() => handleRatingSelect('bad')} className="flex-1 flex flex-col items-center justify-center gap-2 p-6 bg-zinc-800 rounded-2xl border-2 border-transparent hover:border-red-500 transition-colors">
                                <ThumbsDown size={40} className="text-red-400"/>
                                 <span className="text-xl font-semibold">Bad Vibe</span>
                            </motion.button>
                        </div>
                    </motion.div>
                );
            case 'tags':
                 return (
                    <motion.div key="tags" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <button onClick={() => setStep('rating')} className="p-1 text-zinc-400 hover:text-white"><ChevronLeft /></button>
                            <h2 className="text-2xl font-bold">Anything to add?</h2>
                        </div>
                        <p className="text-zinc-400 mt-1 pl-8">Describe them in a few words (optional).</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {relevantTags.map(tag => (
                                <button 
                                    key={tag} 
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1.5 text-sm rounded-full transition-colors border ${selectedTags.includes(tag) ? 'bg-pink-600 border-pink-600 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
                                >{tag}</button>
                            ))}
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full mt-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${PREMIUM_GRADIENT} hover:opacity-90 transition-opacity disabled:opacity-50`}
                        >
                            {loading ? <LoadingSpinner/> : 'Submit Feedback'}
                        </motion.button>
                    </motion.div>
                );
            case 'submitted':
                return (
                     <motion.div key="submitted" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                        <CheckCircle size={56} className="mx-auto text-green-400"/>
                        <h2 className="text-2xl font-bold mt-4">Feedback Sent!</h2>
                        <p className="text-zinc-400 mt-2">Thanks for sharing. If you both had a good time, we'll let you know and create a match for you to chat!</p>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className={`w-full mt-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${PREMIUM_GRADIENT}`}
                        >
                            Done
                        </motion.button>
                     </motion.div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-zinc-950/60 backdrop-blur-xl rounded-3xl w-full max-w-sm p-8 border border-zinc-700 shadow-2xl shadow-purple-500/10"
            >
                {step !== 'submitted' && <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X /></button>}
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default VibeCheckModal;