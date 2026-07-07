import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

const sessions = [
  {
    title: 'OPEN MIC FRIDAY',
    description: 'Submit your track. Get heard. No filter.',
    date: 'Every Friday, 9PM EST',
    location: 'Global Stream',
    attendees: '3.2K watching',
    image: '/images/concert-crowd.jpg',
    status: 'WEEKLY',
  },
  {
    title: 'STUDIO SESSIONS',
    description: 'Watch producers craft beats in real-time. Learn the process.',
    date: 'Sat & Sun, 2PM EST',
    location: 'Studio A',
    attendees: '1.8K watching',
    image: '/images/studio-session.jpg',
    status: 'LIVE SOON',
  },
];

const Sessions = () => {
  return (
    <section id="sessions" className="py-16 md:py-24 bg-pablo-charcoal relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pablo-orange/30 to-transparent" />

      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="font-oswald text-sm tracking-[0.3em] text-pablo-orange uppercase">Don't Miss Out</span>
          <h2 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-tight text-pablo-cream mt-3">
            LIVE <span className="text-pablo-orange">SESSIONS</span>
          </h2>
        </motion.div>

        {/* Session cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sessions.map((session, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative overflow-hidden cursor-pointer border border-white/5 hover:border-pablo-orange/30 transition-all"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={session.image}
                  alt={session.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pablo-dark via-pablo-dark/60 to-transparent" />
                
                {/* Status */}
                <div className="absolute top-4 right-4">
                  <span className={`font-oswald text-xs tracking-[0.2em] uppercase px-3 py-1.5 font-bold ${
                    session.status === 'LIVE SOON'
                      ? 'bg-pablo-gold text-pablo-dark'
                      : 'bg-pablo-orange text-white'
                  }`}>
                    {session.status}
                  </span>
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="font-oswald text-3xl md:text-4xl font-bold text-pablo-cream tracking-wider uppercase mb-3 group-hover:text-pablo-orange transition-colors">
                    {session.title}
                  </h3>
                  <p className="text-white/60 mb-5 max-w-md">{session.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs text-white/40">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-pablo-orange" />
                      <span className="font-oswald tracking-wider">{session.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-pablo-orange" />
                      <span className="font-oswald tracking-wider">{session.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-pablo-orange" />
                      <span className="font-oswald tracking-wider">{session.attendees}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-pablo-orange font-oswald text-sm tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>JOIN SESSION</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sessions;
