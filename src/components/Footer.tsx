import { Mic, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-pablo-dark border-t border-white/5 relative overflow-hidden">
      {/* Big background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-oswald text-[25vw] font-bold text-white/[0.02] uppercase tracking-tighter leading-none">
          MIC IN
        </span>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Newsletter / CTA Section */}
        <div className="py-16 md:py-24 border-b border-white/5">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-oswald text-4xl md:text-6xl font-bold uppercase tracking-tight text-pablo-cream mb-4">
              STAY ON THE <span className="text-pablo-orange">FREQUENCY</span>
            </h2>
            <p className="text-white/40 mb-8 font-oswald tracking-wider uppercase text-sm">
              New drops. Live sessions. No spam. Ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/30 px-5 py-4 text-sm focus:outline-none focus:border-pablo-orange transition-colors font-inter"
              />
              <button className="bg-pablo-orange text-white px-8 py-4 font-oswald text-sm font-bold tracking-[0.2em] uppercase hover:bg-pablo-burnt transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Mic className="w-5 h-5 text-pablo-orange" />
              <span className="font-oswald text-lg font-bold tracking-wider text-white uppercase">
                Mic <span className="text-pablo-orange">In</span>
              </span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed">
              Live music. Live chat.<br />Live energy. Always.
            </p>
          </div>

          <div>
            <h4 className="font-oswald text-sm tracking-[0.2em] text-white/60 uppercase mb-6 font-bold">Platform</h4>
            <ul className="space-y-3">
              {['Live Stream', 'Tracks', 'Chat Rooms', 'Open Mic'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/30 hover:text-pablo-orange transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-oswald text-sm tracking-[0.2em] text-white/60 uppercase mb-6 font-bold">Community</h4>
            <ul className="space-y-3">
              {['Artists', 'Producers', 'Events', 'Blog'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/30 hover:text-pablo-orange transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-oswald text-sm tracking-[0.2em] text-white/60 uppercase mb-6 font-bold">Legal</h4>
            <ul className="space-y-3">
              {['Privacy', 'Terms', 'Cookies', 'DMCA'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/30 hover:text-pablo-orange transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20 font-oswald tracking-wider">
            © {new Date().getFullYear()} MIC IN. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-white/20">
            <span>MADE WITH</span>
            <Heart className="w-3 h-3 text-pablo-orange fill-pablo-orange" />
            <span>FOR THE CULTURE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
