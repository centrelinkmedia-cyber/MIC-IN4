import { motion } from 'framer-motion';
import { Volume2, Radio } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pablo-dark">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pablo-dark/60 via-pablo-dark/40 to-pablo-dark" />
      </div>

      {/* Layered decorative text — TLOP style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <span className="absolute top-[15%] -left-[5%] font-oswald text-[20vw] font-bold text-white/[0.03] uppercase leading-none tracking-tighter">
          MIC IN
        </span>
        <span className="absolute bottom-[10%] -right-[5%] font-oswald text-[15vw] font-bold text-pablo-orange/[0.05] uppercase leading-none tracking-tighter">
          LIVE
        </span>
        <span className="absolute top-[40%] left-[10%] font-oswald text-[8vw] font-bold text-pablo-gold/[0.04] uppercase leading-none tracking-tighter rotate-[-5deg]">
          WHICH / ONE
        </span>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 md:px-6 pt-24">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/40 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="font-oswald text-xs tracking-[0.3em] text-red-400 uppercase font-bold">
                LIVE NOW — 2,847 listening
              </span>
            </div>
          </motion.div>

          {/* Main headline — TLOP style layered */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mb-6"
          >
            <h1 className="font-oswald text-7xl sm:text-8xl md:text-[10rem] font-bold uppercase leading-[0.85] tracking-tight">
              <span className="text-pablo-cream block">MIC</span>
              <span className="text-pablo-orange block glitch-hover">IN</span>
            </h1>
          </motion.div>

          {/* Subtitle — raw, unfinished feel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-10"
          >
            <p className="font-oswald text-lg sm:text-xl md:text-2xl text-white/60 tracking-[0.15em] uppercase">
              The frequency is everything
            </p>
            <div className="w-20 h-[2px] bg-pablo-orange mx-auto mt-4" />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
          >
            <button className="w-full sm:w-auto px-10 py-5 bg-pablo-orange text-white font-oswald text-lg font-bold tracking-[0.15em] uppercase hover:bg-pablo-burnt transition-all flex items-center justify-center gap-3 border-2 border-pablo-orange hover:border-pablo-gold">
              <Radio className="w-5 h-5" />
              TUNE IN LIVE
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-transparent text-pablo-cream font-oswald text-lg font-bold tracking-[0.15em] uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-3 border-2 border-white/20 hover:border-pablo-orange">
              <Volume2 className="w-5 h-5" />
              BROWSE TRACKS
            </button>
          </motion.div>

          {/* Equalizer bars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-end gap-1 h-12"
          >
            {[40, 70, 30, 85, 55, 95, 45, 75, 35, 90, 50, 80, 60, 40, 70, 55, 85, 45, 65, 50].map((h, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-pablo-orange/80 rounded-full"
                animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.5}%`, `${h * 0.8}%`, `${h * 0.3}%`] }}
                transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="absolute bottom-0 left-0 w-full bg-pablo-orange py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="font-oswald text-sm tracking-[0.3em] text-white/90 uppercase mx-8">
              🎤 NEW DROP: "LATE REGISTRATION" BY VANCE — NOW STREAMING &nbsp;&nbsp;⚡&nbsp;&nbsp; LIVE SESSION WITH DJ NOVA IN 30 MIN &nbsp;&nbsp;🔥&nbsp;&nbsp; CHAT IS GOING CRAZY &nbsp;&nbsp;💿&nbsp;&nbsp; SUBMIT YOUR TRACK — OPEN MIC FRIDAYS &nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
