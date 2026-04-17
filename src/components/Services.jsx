export default function Services() {
  return (
    <section className="ftco-section font-sans" id="services-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12 heading-section text-center ftco-animate mb-5">
            <span className="subheading">Services</span>
            <h2 className="mb-4">Les services que je peux assurer</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-lg-4">
            <div className="media block-6 services d-block bg-white rounded-lg shadow ftco-animate">
              <div className="icon d-flex align-items-center justify-content-center">
                <span className="flaticon-app-development" />
              </div>
              <div className="media-body">
                <h3 className="heading mb-3">Application Mobile</h3>
                <p>
                  J&apos;ai des compétences en <strong>Flutter</strong> que je serais ravi de performer en
                  travaillant sur de nouveaux projets
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="media block-6 services d-block bg-white rounded-lg shadow ftco-animate">
              <div className="icon shadow d-flex align-items-center justify-content-center">
                <span className="flaticon-web-programming" />
              </div>
              <div className="media-body">
                <h3 className="heading mb-3">Conception de site web</h3>
                <p>
                  Mes connaissances en <strong>ASP .NET</strong>, <strong>Spring Boot</strong>{' '}
                  <strong>React JS</strong> me permettent de mener à bien un projet de création d&apos;un site
                  web
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="media block-6 services d-block bg-white rounded-lg shadow ftco-animate">
              <div className="icon shadow d-flex align-items-center justify-content-center">
                <span className="flaticon-3d-design" />
              </div>
              <div className="media-body">
                <h3 className="heading mb-3">Conception de base de données</h3>
                <p>
                  Mes projets m&apos;ont permis d&apos;acquérir des connaissances sur la conception des bases de
                  données (<strong>Sql Server</strong>, <strong>MySql</strong>, <strong>Oracle</strong>,{' '}
                  <strong>Postgre</strong>)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
