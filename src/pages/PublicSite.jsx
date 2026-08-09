import About from '../components/About';
import Service from '../components/Service';
import Contact from '../components/Contact';
import ContactModal from '../components/ContactModal';
import Experience from '../components/Experience';
import Footer from '../components/Footer';
import GalleryStrip from '../components/GalleryStrip';
import Hero from '../components/Hero';
import Nav from '../components/Nav';
import Portfolio from '../components/Portfolio';
import { ContactModalProvider } from '../context/ContactModalContext';
import { SiteProfileProvider } from '../context/SiteProfileContext';

export default function PublicSite() {
  return (
    <SiteProfileProvider>
      <ContactModalProvider>
        <Nav />
        <Hero />
        <About />
        <GalleryStrip />
        <Experience />
        <Portfolio />
        <Service />
        <Contact />
        <Footer />
        <ContactModal />
      </ContactModalProvider>
    </SiteProfileProvider>
  );
}
