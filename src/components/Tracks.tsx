import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Clock, Flame, TrendingUp } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  plays: string;
  isHot: boolean;
  cover: string;
}

const tracks: Track[] = [
  { id: 1, title: 'ULTRALIGHT DREAMS', artist: 'DJ Nova', duration: '4:32', plays: '1.2M', isHot: true, cover: '🟠' },
  { id: 2, title: 'WAVES DON\'T DIE', artist: 'Vance', duration: '3:47', plays: '890K', isHot: true, cover: '🔴' },
  { id: 3, title: 'FATHER STRETCH MY HANDS', artist: 'Saint Pablo', duration: '5:14', plays: '2.1M', isHot: true, cover: '🟡' },
  { id: 4, title: 'FREESTYLE 4EVER', artist: 'K.Dot', duration: '3:21', plays: '450K', isHot: false, cover: '🟤' },
  { id: 5, title: 'NO MORE PARTIES', artist: 'LA Confidential', duration: '4:05', plays: '670K', isHot: false, cover: '⚫' },
  { id: 6, title: 'FACTS (CHARLIE HEAT)', artist: 'Heatwave', duration: '3:55', plays: '780K', isHot: true, cover: '🔥' },
  { id: 7, title: 'REAL FRIENDS ONLY', artist: 'Innerzone', duration: '4:42', plays: '320K', isHot: false, cover: '🟧' },
  { id: 8, title: 'FAMOUS LAST WORDS', artist: 'Sunday Service', duration: '6:01', plays: '1.5M', isHot: true, cover: '✨' },
];

const Tracks = () => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set([1, 3, 6]));

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="tracks" className="py-16 md:py-24 bg-pablo-charcoal relative">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pablo-orange/40 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-pablo-orange" />
              <span className="font-oswald text-sm tracking-[0.3em] text-pablo-orange uppercase">Trending Now</span>
            </div>
            <h2 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-tight text-pablo-cream">
              HOT <span className="text-pablo-orange">TRACKS</span>
            </h2>
          </motion.div>
          <button className="font-oswald tracking-[0.2em] text-sm text-white/50 hover:text-pablo-orange transition-colors uppercase border-b border-white/20 hover:border-pablo-orange pb-1 self-start md:self-auto">
            VIEW ALL TRACKS →
          </button>
        </div>

        {/* Track list */}
        <div className="space-y-1">
          {tracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`group flex items-center gap-4 p-4 hover:bg-white/5 transition-all cursor-pointer border-b border-white/5 ${
                playingId === track.id ? 'bg-pablo-orange/10 border-l-2 border-l-pablo-orange' : ''
              }`}
              onClick={() => setPlayingId(playingId === track.id ? null : track.id)}
            >
              {/* Number / Play */}
              <div className="w-10 text-center flex-shrink-0">
                {playingId === track.id ? (
                  <Pause className="w-5 h-5 text-pablo-orange mx-auto" />
                ) : (
                  <>
                    <span className="font-oswald text-white/30 group-hover:hidden">{String(index + 1).padStart(2, '0')}</span>
                    <Play className="w-5 h-5 text-pablo-orange mx-auto hidden group-hover:block" />
                  </>
                )}
              </div>

              {/* Cover art placeholder */}
              <div className="w-12 h-12 bg-pablo-dark flex items-center justify-center text-2xl flex-shrink-0 border border-white/5">
                {track.cover}
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-oswald text-sm md:text-base font-bold tracking-wider truncate ${
                    playingId === track.id ? 'text-pablo-orange' : 'text-pablo-cream'
                  }`}>
                    {track.title}
                  </h3>
                  {track.isHot && (
                    <Flame className="w-3.5 h-3.5 text-pablo-orange flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-white/40 font-oswald tracking-wider">{track.artist}</p>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-white/30 flex-shrink-0">
                <Play className="w-3 h-3" />
                <span className="font-oswald tracking-wider">{track.plays}</span>
              </div>

              {/* Duration */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/30 flex-shrink-0">
                <Clock className="w-3 h-3" />
                <span className="font-oswald tracking-wider">{track.duration}</span>
              </div>

              {/* Like button */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
                className="flex-shrink-0 p-2"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    likedIds.has(track.id)
                      ? 'text-pablo-orange fill-pablo-orange'
                      : 'text-white/20 hover:text-pablo-orange'
                  }`}
                />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Now playing bar */}
        {playingId !== null && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 bg-pablo-orange/10 border border-pablo-orange/30 p-4 flex items-center gap-4"
          >
            <div className="flex items-center gap-1 h-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-pablo-orange rounded-full"
                  animate={{ height: ['30%', '100%', '50%', '80%', '30%'] }}
                  transition={{ duration: 0.8 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>
            <div className="flex-1">
              <span className="font-oswald text-sm text-pablo-orange tracking-wider">
                NOW PLAYING: {tracks.find(t => t.id === playingId)?.title}
              </span>
              <span className="text-xs text-white/40 ml-3">
                {tracks.find(t => t.id === playingId)?.artist}
              </span>
            </div>
            <div className="w-32 md:w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-pablo-orange rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Tracks;
