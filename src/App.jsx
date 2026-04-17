import About from './components/About';
import Blog from './components/Blog';
import Contact from './components/Contact';
import CTA from './components/CTA';
import Experience from './components/Experience';
import Footer from './components/Footer';
import GalleryStrip from './components/GalleryStrip';
import Hero from './components/Hero';
import Nav from './components/Nav';
import Portfolio from './components/Portfolio';

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <GalleryStrip />
      <Experience />
      <CTA />
      <Portfolio />
      <Blog />
      <Contact />
      <Footer />
    </>
  );
}
