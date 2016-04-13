import helmet from 'helmet';

export default function configureHelmet(app) {
  const EIGHTEEN_WEEKS_IN_MILLISECONDS = 10886400000;

  app.use(helmet.hidePoweredBy());
  // includeSubDomains and a maxAge of at least 18 weeks
  // are required to be added to Chromium hsts preload list
  app.use(helmet.hsts({
    maxAge: EIGHTEEN_WEEKS_IN_MILLISECONDS,
    includeSubDomains: true,
    preload: true
  }));
  app.use(helmet.nocache({ noEtag: true }));
  app.use(helmet.noSniff());
  app.use(helmet.ienoopen());
  app.use(helmet.xssFilter());
  app.use(helmet.frameguard({ action: 'deny' }));
}
