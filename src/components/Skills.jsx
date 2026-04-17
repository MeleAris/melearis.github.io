import { useProgressCircles } from '../hooks/useProgressCircles';

function CircularSkill({ title, value }) {
  return (
    <div className="col-lg-3 mb-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="h5 font-weight-bold text-center mb-4">{title}</h2>
        <div className="progress mx-auto" data-value={value}>
          <span className="progress-left">
            <span className="progress-bar border-primary" />
          </span>
          <span className="progress-right">
            <span className="progress-bar border-primary" />
          </span>
          <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
            <div className="h2 font-weight-bold">
              {value}
              <sup className="small">%</sup>
            </div>
          </div>
        </div>
        <div className="row text-center mt-4">
          <div className="col-6 border-right">
            <div className="h4 font-weight-bold mb-0" />
            <span className="small text-gray" />
          </div>
          <div className="col-6">
            <div className="h4 font-weight-bold mb-0" />
            <span className="small text-gray" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  useProgressCircles();

  return (
    <section className="ftco-section bg-light font-sans" id="skills-section">
      <div className="container">
        <div className="row justify-content-center pb-5">
          <div className="col-md-12 heading-section text-center ftco-animate">
            <span className="subheading">Compétences</span>
            <h2 className="mb-4">Mes compétences</h2>
          </div>
        </div>
        <div className="row progress-circle mb-5">
          <CircularSkill title="Flutter" value={85} />
          <CircularSkill title="React JS" value={75} />
          <CircularSkill title="ASP .NET" value={50} />
          <CircularSkill title="Spring Boot" value={50} />

          <div className="col-lg-6 mb-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="h5 font-weight-bold text-center mb-4">Logiciels et SE</h2>
              <div className="progress mx-auto" data-value={95}>
                <span className="progress-left">
                  <span className="progress-bar border-primary" />
                </span>
                <span className="progress-right">
                  <span className="progress-bar border-primary" />
                </span>
                <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                  <div className="h2 font-weight-bold">
                    95<sup className="small">%</sup>
                  </div>
                </div>
              </div>
              <div className="row text-center mt-4">
                <div className="col-6 border-right">
                  <div className="small text-gray">Windows</div>
                  <span className="small text-gray">Ubuntu</span>
                </div>
                <div className="col-6">
                  <div className="small text-gray">Pack Office</div>
                  <span className="small text-gray" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="h5 font-weight-bold text-center mb-4">Base de données</h2>
              <div className="progress mx-auto" data-value={95}>
                <span className="progress-left">
                  <span className="progress-bar border-primary" />
                </span>
                <span className="progress-right">
                  <span className="progress-bar border-primary" />
                </span>
                <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                  <div className="h2 font-weight-bold">
                    95<sup className="small">%</sup>
                  </div>
                </div>
              </div>
              <div className="row text-center mt-4">
                <div className="col-6 border-right">
                  <div className="small text-gray">Sql Server</div>
                  <span className="small text-gray">MySql</span>
                </div>
                <div className="col-6">
                  <div className="small text-gray">Firebase</div>
                  <span className="small text-gray">Postgre</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
