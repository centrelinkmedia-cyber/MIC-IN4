import { motion } from 'framer-motion';
import { Headphones, ExternalLink } from 'lucide-react';

const artists = [
  {
    name: 'DJ NOVA',
    genre: 'Electronic / Hip-Hop',
    image: '/images/artist1.jpg',
    listeners: '12.4K',
    tag: 'RESIDENT',
  },
  {
    name: 'VANCE',
    genre: 'R&B / Soul',
    image: '/images/artist2.jpg',
    listeners: '8.7K',
    tag: 'FEATURED',
  },
  {
    name: 'HEATWAVE',
    genre: 'Trap / Production',
    image: '/images/artist3.jpg',
    listeners: '15.2K',
    tag: 'LIVE NOW',
  },
];

const Artists = () => {
  return (
    <section id="artists" className="py-16 md:py-24 bg-pablo-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[20%] right-0 w-[400px] h-[400px] bg-pablo-orange/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-oswald text-sm tracking-[0.3em] text-pablo-orange uppercase">The Lineup</span>
            <h2 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-tight text-pablo-cream mt-3">
              FEATURED <span className="text-pablo-orange">ARTISTS</span>
            </h2>
          </motion.div>
        </div>

        {/* Artist grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {artists.map((artist, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pablo-dark via-pablo-dark/30 to-transparent" />
                
                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className={`font-oswald text-xs tracking-[0.2em] uppercase px-3 py-1.5 font-bold ${
                    artist.tag === 'LIVE NOW' 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-pablo-orange/90 text-white'
                  }`}>
                    {artist.tag}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-pablo-orange/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-pablo-orange flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-oswald text-2xl md:text-3xl font-bold text-pablo-cream tracking-wider uppercase group-hover:text-pablo-orange transition-colors">
                  {artist.name}
                </h3>
                <p className="font-oswald text-xs tracking-[0.2em] text-white/50 uppercase mt-1 mb-3">
                  {artist.genre}
                </p>
                <div className="flex items-center gap-2">
                  <Headphones className="w-3.5 h-3.5 text-pablo-orange" />
                  <span className="font-oswald text-xs tracking-wider text-white/40">
                    {artist.listeners} monthly listeners
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="font-oswald tracking-[0.2em] text-sm text-pablo-orange hover:text-pablo-gold transition-colors uppercase border border-pablo-orange/40 hover:border-pablo-gold px-10 py-4 hover:bg-pablo-orange/5">
            EXPLORE ALL ARTISTS →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Artists;
