import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tracks from './components/Tracks';
import LiveChat from './components/LiveChat';
import Artists from './components/Artists';
import Sessions from './components/Sessions';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-pablo-dark text-white font-inter">
      <Navbar />
      <main>
        <Hero />
        <Tracks />
        <LiveChat />
        <Artists />
        <Sessions />
      </main>
      <Footer />
    </div>
  );
}

export default App;
