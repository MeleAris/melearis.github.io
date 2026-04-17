export default function About() {
  return (
    <section className="ftco-about ftco-section ftco-no-pt ftco-no-pb font-sans" id="about-section">
      <div className="container">
        <div className="row d-flex no-gutters">
          <div className="col-md-6 col-lg-7 pl-md-4 pl-lg-5 py-5">
            <div className="py-md-5">
              <div className="row justify-content-start pb-3">
                <div className="col-md-12 heading-section ftco-animate">
                  <span className="subheading">Présentation</span>
                  <h2 className="mb-4" style={{ fontSize: '34px', textTransform: 'capitalize' }}>
                    Description
                  </h2>
                  <p>
                    Dynamique, ambitieux et avide d&apos;apprendre, je suis une personne passionnée par
                    l&apos;informatique. Travailler en équipe et sous pression ne me pose aucun problème.
                    Mes qualités d&apos;organisation me permettent de structurer efficacement mon travail et de
                    gérer mes priorités avec succès.
                  </p>

                  <ul className="about-info mt-4 px-md-0 px-2">
                    <li className="d-flex">
                      <span>Nom & Prénoms:</span> <span>MELESUSU Kwami Aristide</span>
                    </li>
                    <li className="d-flex">
                      <span>Nationalité:</span> <span>Togolaise</span>
                    </li>
                    <li className="d-flex">
                      <span>Adresse:</span> <span>Sagbado, Lomé - TOGO</span>
                    </li>
                    <li className="d-flex">
                      <span>Email:</span> <span>amelesusu@gmail.com</span>
                    </li>
                    <li className="d-flex">
                      <span>Téléphone: </span> <span>+228 99626391 / 93567127</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <div className="my-interest d-lg-flex w-100">
                    <div className="interest-wrap d-flex align-items-center">
                      <div className="icon d-flex align-items-center justify-content-center">
                        <span className="flaticon-computer" />
                      </div>
                      <div className="text">Lecture</div>
                    </div>
                    <div className="interest-wrap d-flex align-items-center">
                      <div className="icon d-flex align-items-center justify-content-center">
                        <span className="flaticon-listening" />
                      </div>
                      <div className="text">Musique</div>
                    </div>
                    <div className="interest-wrap d-flex align-items-center">
                      <div className="icon d-flex align-items-center justify-content-center">
                        <span className="flaticon-football" />
                      </div>
                      <div className="text">Sport</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
