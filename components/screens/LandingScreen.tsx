

import * as React from 'react';
import { motion } from 'framer-motion';
import { Heart, CalendarPlus, Briefcase, GraduationCap, Users, ShieldCheck, Mail, UserPlus, Coffee, Star as StarIcon } from 'lucide-react';
import { PREMIUM_GRADIENT } from '../../constants.tsx';
import { useNotification } from '../../hooks/useNotification.ts';

const features = [
  { icon: <Heart className="w-8 h-8 text-pink-400" />, title: "Meaningful Connections", description: "Swipe and match with verified students from your own college and other nearby institutions." },
  { icon: <CalendarPlus className="w-8 h-8 text-purple-400" />, title: "Blind Dates", description: "Skip the small talk. Book a date at a partner café based on vibes, not just photos." },
  { icon: <Briefcase className="w-8 h-8 text-indigo-400" />, title: "Group Trips", description: "Join curated 'Stranger' trips or plan getaways with your match. Adventure awaits!" },
  { icon: <GraduationCap className="w-8 h-8 text-blue-400" />, title: "Campus Events", description: "Discover and RSVP to exclusive college fests, workshops, and parties." },
  { icon: <ShieldCheck className="w-8 h-8 text-green-400" />, title: "Exclusive & Safe", description: "A secure, private network only for verified college students. Your safety is our priority." },
  { icon: <Users className="w-8 h-8 text-yellow-400" />, title: "Build Your Circle", description: "More than just dating. Find friends, project partners, and build your college network." }
];

const howItWorksSteps = [
    { icon: <UserPlus />, title: "Create Your Profile", description: "Sign up with your student email and show off your personality with photos, prompts, and interests." },
    { icon: <Heart />, title: "Swipe & Match", description: "Explore profiles of students near you. Swipe right to like, and if they like you back, it's a match!" },
    { icon: <Coffee />, title: "Meet in Real Life", description: "Chat with your matches, go on blind dates, or join group trips. The best connections happen offline." },
];

const testimonials = [
    { name: "Priya S.", college: "VIT Delhi", quote: "I was tired of generic dating apps. CollegeCrush is so much better because everyone is a student. I met my boyfriend on a 'Stranger Trip'!", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=387&auto=format&fit=crop" },
    { name: "Rohan K.", college: "IIIT Delhi", quote: "The blind date feature is genius! It's way less pressure and you actually get to know the person. Met some really cool people through it.", image: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=876&auto=format&fit=crop" },
];

const team = [
  { name: "Anurag", role: "Team Leader & Frontend Developer", image: "https://placehold.co/96x96/ec4899/ffffff/png?text=A" },
  { name: "Abhay", role: "Backend (DB & Auth)", image: "https://placehold.co/96x96/8b5cf6/ffffff/png?text=A" },
  { name: "Shaurya", role: "Backend (API & Logic)", image: "https://placehold.co/96x96/3b82f6/ffffff/png?text=S" },
  { name: "Gauransh", role: "Frontend (UI & Responsiveness)", image: "https://placehold.co/96x96/14b8a6/ffffff/png?text=G" },
];

const AuroraBackground = () => <div className="aurora-bg"></div>;

interface LandingScreenProps {
    onGetStarted: () => void;
}

function LandingScreen({ onGetStarted }: LandingScreenProps) {
    const { showNotification } = useNotification();

    const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        showNotification("This is a demo form. In a real app, this would send an email!", 'info');
        e.currentTarget.reset();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };
    
    const textVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    
    const AnimatedTitle = ({ text }: {text: string}) => (
        <motion.span variants={textVariants} initial="hidden" animate="visible" className="inline-block">
            {text.split("").map((char, index) => (
                <motion.span key={char + "-" + index} variants={letterVariants} className="inline-block">
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );

  return (
    <div className="bg-black text-white font-sans overflow-x-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }} animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/50 backdrop-blur-lg border-b border-zinc-800/50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">College</span><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-400">Crush</span>
          </h1>
          <button onClick={onGetStarted} className="bg-white text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-neutral-200 transition-colors">
            Launch App
          </button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="h-screen min-h-[800px] flex items-center justify-center text-center p-4 pt-20 relative overflow-hidden">
        <AuroraBackground />
        <div className="relative z-10">
          <h1
            className="text-5xl md:text-7xl font-extrabold"
          >
            <AnimatedTitle text="Beyond the Swipe." />
            <br />
            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${PREMIUM_GRADIENT} animated-gradient-text`}>
              <AnimatedTitle text="Real Connections." />
            </span>
          </h1>
          <motion.p
            variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 1 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-neutral-300"
          >
            The exclusive network for Indian college students to meet, date, and discover real-world experiences together.
          </motion.p>
            {/* Desktop Hero Cards */}
           <motion.div className="mt-12 relative w-full max-w-lg h-64 mx-auto hidden md:block" initial="hidden" animate="visible" variants={itemVariants} transition={{ delay: 1.2 }}>
                <motion.div
                    className="absolute top-0 left-[15%] w-48 h-64 bg-zinc-800 rounded-2xl shadow-2xl p-3 transform -rotate-6 overflow-hidden"
                    animate={{ rotate: [-6, -4, -6], y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=387&auto=format&fit=crop" alt="Profile 1" className="w-full h-full object-cover rounded-lg" />
                </motion.div>
                <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-72 bg-zinc-800 rounded-2xl shadow-2xl p-3 z-10 overflow-hidden"
                    animate={{ scale: [1, 1.02, 1], y: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                     <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=464&auto=format&fit=crop" alt="Profile 2" className="w-full h-full object-cover rounded-lg" />
                </motion.div>
                <motion.div
                    className="absolute top-0 right-[15%] w-48 h-64 bg-zinc-800 rounded-2xl shadow-2xl p-3 transform rotate-6 overflow-hidden"
                    animate={{ rotate: [6, 4, 6], y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                     <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=461&auto=format&fit=crop" alt="Profile 3" className="w-full h-full object-cover rounded-lg" />
                </motion.div>
            </motion.div>
            {/* Mobile Hero Card */}
            <motion.div
                className="mt-10 relative w-64 h-96 mx-auto block md:hidden"
                variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 1.2 }}
            >
                <motion.div
                    className="w-full h-full bg-zinc-800 rounded-2xl shadow-2xl p-3 transform overflow-hidden"
                    animate={{
                        rotate: [2, -2, 2],
                        y: [0, -10, 0],
                        boxShadow: [
                            "0 25px 50px -12px rgba(236, 72, 153, 0.25)",
                            "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
                            "0 25px 50px -12px rgba(236, 72, 153, 0.25)"
                        ]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=464&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <div>
                            <h3 className="text-white font-bold text-xl">Jessica, 21</h3>
                            <p className="text-zinc-300 text-sm">IIIT Delhi</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 1.4 }}>
            <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(236, 72, 153, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className={`mt-10 md:mt-24 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r ${PREMIUM_GRADIENT} transition-shadow text-lg`}
            >
                Get Started
            </motion.button>
          </motion.div>
        </div>
      </section>
      
        {/* How it Works Section */}
       <section id="how-it-works" className="py-20 px-4">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold">How It Works</h2>
                <p className="text-neutral-400 mt-4 max-w-xl mx-auto">Three simple steps to find your next connection.</p>
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="grid md:grid-cols-3 gap-8 md:gap-12 mt-12 text-center md:text-left"
                >
                {howItWorksSteps.map((step, index) => (
                    <motion.div key={step.title} variants={itemVariants} className="flex flex-col items-center md:items-start">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-2xl mb-4">
                            {React.cloneElement(step.icon, { size: 32 })}
                        </div>
                        <h3 className="text-xl font-bold">{step.title}</h3>
                        <p className="text-neutral-400 mt-2">{step.description}</p>
                    </motion.div>
                ))}
                </motion.div>
            </div>
        </section>


      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-neutral-950">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center">Why You'll Love CollegeCrush</h2>
          <p className="text-neutral-400 text-center mt-4 max-w-xl mx-auto">Everything you need to navigate your college social life, all in one app.</p>
          <motion.div 
             variants={containerVariants}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.2 }}
             className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          >
            {features.map((feature) => (
              <motion.div 
                key={feature.title}
                variants={itemVariants}
                className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 transition-all duration-300 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1"
              >
                {feature.icon}
                <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
                <p className="text-neutral-400 mt-2">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

       {/* Testimonials Section */}
       <section id="testimonials" className="py-20 px-4">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold">Don't Just Take Our Word For It</h2>
                 <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="grid md:grid-cols-2 gap-8 mt-12"
                 >
                    {testimonials.map((t) => (
                        <motion.div key={t.name} variants={itemVariants} className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 text-left">
                           <div className="flex gap-1 text-yellow-400 mb-2">
                                <StarIcon fill="currentColor" size={16}/><StarIcon fill="currentColor" size={16}/><StarIcon fill="currentColor" size={16}/><StarIcon fill="currentColor" size={16}/><StarIcon fill="currentColor" size={16}/>
                           </div>
                           <p className="text-neutral-300 italic">"{t.quote}"</p>
                           <div className="flex items-center mt-4">
                                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                                <div className="ml-4">
                                    <p className="font-semibold">{t.name}</p>
                                    <p className="text-sm text-neutral-400">{t.college}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4 bg-neutral-950">
        <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold">Meet the Team</h2>
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12"
            >
                {team.map((member) => (
                    <motion.div key={member.name} variants={itemVariants} className="flex flex-col items-center">
                        <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover" />
                        <h3 className="text-lg font-bold mt-4">{member.name}</h3>
                        <p className="text-neutral-400 text-sm">{member.role}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold">Have Questions?</h2>
            <p className="text-neutral-400 mt-4">We'd love to hear from you. Drop us a line and we'll get back to you as soon as we can.</p>
            <motion.form 
                onSubmit={handleContactSubmit}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="mt-8 flex flex-col md:flex-row gap-4"
            >
                <input type="email" placeholder="your.email@college.com" required className="flex-1 p-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={`px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r ${PREMIUM_GRADIENT} transition-shadow`}
                >
                    Contact Us
                </motion.button>
            </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-neutral-800/50">
        <div className="container mx-auto text-center text-neutral-500">
            <p>&copy; {new Date().getFullYear()} CollegeCrush. All Rights Reserved.</p>
            <p className="text-sm mt-2">Made with <Heart size={14} className="inline text-pink-500" /> by students, for students.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingScreen;
