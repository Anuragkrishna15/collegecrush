import React from 'react';
import { Profile, MembershipType } from '../types.ts';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { getOptimizedUrl } from '../utils/date.ts';
import { PREMIUM_GRADIENT } from '../constants.tsx';


interface ProfileCardProps {
  profile: Profile;
  onClick: () => void;
}

const ProfileCard = React.memo(function ProfileCard({ profile, onClick }: ProfileCardProps) {
  return (
    <motion.div 
        className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-transparent cursor-pointer group p-px"
        onClick={onClick}
    >
       <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${PREMIUM_GRADIENT} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
       <div className="relative w-full h-full bg-black/40 rounded-[23px] overflow-hidden">
        {profile.profilePics.length > 1 && (
            <div className="absolute top-3 inset-x-3 z-10 h-1 flex items-center gap-1.5">
                {profile.profilePics.map((pic, i) => (
                    <div key={pic} className={`h-full flex-1 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`} />
                ))}
            </div>
        )}
        <img src={getOptimizedUrl(profile.profilePics[0], { width: 400, height: 600 })} alt={profile.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
            <div>
            <h2 className="text-3xl font-bold text-white flex items-center">
                {profile.name}, <span className="font-light ml-2">{profile.age}</span>
                {profile.membership === MembershipType.Premium && (
                    <Crown size={20} className="ml-2 text-yellow-400" />
                )}
            </h2>
            <p className="text-zinc-300 text-sm mt-1">{profile.college}</p>
            </div>
            <p className="text-zinc-300 text-sm mt-3 line-clamp-2">{profile.bio}</p>
            <div className="flex flex-wrap gap-2 mt-4">
            {profile.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                {tag}
                </span>
            ))}
            </div>
        </div>
       </div>
    </motion.div>
  );
});

export default ProfileCard;