import { HEADER_SCROLL_OFFSET } from '../constants/layout';

function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ftco-footer ftco-section font-sans">
      <div className="container">
        <div className="row mb-5">
          <div className="col-md">
            <div className="ftco-footer-widget mb-4 ml-md-4">
              <h2 className="ftco-heading-2">Menu</h2>
              <ul className="list-unstyled mb-0 pl-0">
                <li>
                  <a href="#home-section" onClick={(e) => { e.preventDefault(); scrollToHash('#home-section'); }}>
                    <span className="fa fa-chevron-right mr-2" />
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#about-section" onClick={(e) => { e.preventDefault(); scrollToHash('#about-section'); }}>
                    <span className="fa fa-chevron-right mr-2" />
                    A propos
                  </a>
                </li>
                <li>
                  <a href="#services-section" onClick={(e) => { e.preventDefault(); scrollToHash('#services-section'); }}>
                    <span className="fa fa-chevron-right mr-2" />
                    Services
                  </a>
                </li>
                <li>
                  <a href="#contact-section" onClick={(e) => { e.preventDefault(); scrollToHash('#contact-section'); }}>
                    <span className="fa fa-chevron-right mr-2" />
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md">
            <div className="ftco-footer-widget mb-4">
              <h2 className="ftco-heading-2">Contact</h2>
              <div className="block-23 mb-3">
                <ul>
                  <li>
                    <a target="_blank" rel="noreferrer" href="https://goo.gl/maps/PiyXmRw2cTNE8gNT8">
                      <span className="icon fa fa-map-marker" />
                      <span className="text">Sagbado, Lomé - TOGO</span>
                    </a>
                  </li>
                  <li>
                    <a href="tel:93567127">
                      <span className="icon fa fa-phone" />
                      <span className="text">+228 93567127</span>
                    </a>
                  </li>
                  <li>
                    <a target="_blank" rel="noreferrer" href="https://wa.me/22899626391">
                      <span className="icon fa fa-whatsapp" /> <span className="text">+228 99626391</span>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:amelesusu@gmail.com">
                      <span className="icon fa fa-paper-plane pr-4" />
                      <span className="text">amelesusu@gmail.com</span>
                    </a>
                  </li>
                </ul>
              </div>
              <ul className="ftco-footer-social list-unstyled mt-2">
                <li className="ftco-animate">
                  <a
                    href="https://twitter.com/melarisk?t=TAxvTmeO4NDJsQOLj_Mw8Q&s=09"
                    title="Twitter"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="fa fa-twitter" />
                  </a>
                </li>
                <li className="ftco-animate">
                  <a href="https://www.instagram.com/aris.mel/" title="Instagram" target="_blank" rel="noreferrer">
                    <span className="fa fa-instagram" />
                  </a>
                </li>
                <li className="ftco-animate">
                  <a
                    href="https://www.linkedin.com/in/aristide-melesusu-3a315b1b5"
                    title="Linkedin"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="fa fa-linkedin" />
                  </a>
                </li>
                <li className="ftco-animate">
                  <a href="https://github.com/MeleAris" title="Github" target="_blank" rel="noreferrer">
                    <span className="fa fa-github" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <p>
              Copyright &copy;{year} All rights reserved | Made with{' '}
              <i className="fa fa-heart" aria-hidden="true" /> by <span>Aristide</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
