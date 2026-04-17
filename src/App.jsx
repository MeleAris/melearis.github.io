import { useEffect, useState } from 'react';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Services from './components/Services';
import Skills from './components/Skills';
import { useAnimateOnScroll } from './hooks/useAnimateOnScroll';

export default function App() {
  const [loading, setLoading] = useState(true);
  useAnimateOnScroll();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-body">
      <Loader visible={loading} />
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <Hero />
      </div>
      <About />
      <Skills />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}
