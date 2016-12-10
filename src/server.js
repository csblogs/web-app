import express from 'express';
import exphbs from 'express-handlebars';
import assets from 'express-asset-versions';
import session from 'express-session';
import compression from 'compression';
import bodyParser from 'body-parser';
import path from 'path';
import log from './log';
import configureHelmet from './security/configure-helmet';
import requestLogger from './log/request-logger';
import indexRoute from './routes/index-route';
import bloggerRoutes from './routes/blogger-routes';
import accountRoutes from './routes/account-routes';
import authRoutes from './routes/auth-routes';
import * as auth from './helpers/authentication';
import * as errorRoutes from './routes/error-routes';
import * as hbsHelpers from './helpers/handlebars';

const app = express();
const port = process.env.PORT;
const assetPath = path.join(__dirname, 'public');

// Set static file max age to 1 year in production mode
const isProduction = (process.env.NODE_ENV === 'production');
const maxAge = isProduction ? 31556952000 : 0;

configureHelmet(app);
app.use(requestLogger);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(session({
  secret: process.env.CSBLOGS_WEB_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: isProduction
  }
}));
app.use(auth.passport.initialize());
app.use(auth.passport.session());
app.use(auth.getUserAvatar);

app.use('/public', express.static(assetPath, { maxAge }));
app.use(assets('/public', assetPath));

app.use('/', indexRoute);
app.use('/', accountRoutes);
app.use('/bloggers', bloggerRoutes);
app.use('/auth', authRoutes);
app.use(errorRoutes.notFoundHandler);
app.use(errorRoutes.errorHandler);

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: 'app/views/layouts/',
  partialsDir: 'app/views/partials/',
  helpers: hbsHelpers
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.listen(port, () => {
  log.info({ port }, 'CSBlogs web app now running');
});
