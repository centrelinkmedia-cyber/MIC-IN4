import { useState, useEffect } from 'react';
import { Menu, X, Mic } from 'lucide-react';
import { cn } from '../utils/cn';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'TRACKS', href: '#tracks' },
    { name: 'LIVE CHAT', href: '#chat' },
    { name: 'ARTISTS', href: '#artists' },
    { name: 'SESSIONS', href: '#sessions' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-500',
        isScrolled
          ? 'bg-pablo-dark/95 backdrop-blur-md py-3 border-b border-pablo-orange/20'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative">
              <Mic className="w-7 h-7 text-pablo-orange group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            <span className="font-oswald text-2xl font-bold tracking-wider text-white uppercase">
              Mic <span className="text-pablo-orange">In</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-oswald text-sm tracking-[0.2em] text-white/70 hover:text-pablo-orange transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-pablo-orange group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <button className="font-oswald tracking-wider bg-pablo-orange text-white px-6 py-2.5 text-sm font-bold hover:bg-pablo-burnt transition-all uppercase border border-pablo-orange hover:border-pablo-gold">
              JOIN LIVE
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-pablo-dark border-t border-pablo-orange/20 absolute top-full left-0 w-full p-6 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block font-oswald text-lg tracking-[0.2em] text-white/70 hover:text-pablo-orange py-3 border-b border-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <button className="w-full mt-4 font-oswald tracking-wider bg-pablo-orange text-white px-6 py-3 text-sm font-bold hover:bg-pablo-burnt uppercase">
            JOIN LIVE
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
