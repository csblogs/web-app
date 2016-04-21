import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import log from './log';
import configureHelmet from './security/configure-helmet';
import requestLogger from './log/request-logger';
import indexRoute from './routes/index-route';
import * as hbsHelpers from './helpers/handlebars';

const app = express();
const port = process.env.PORT;

configureHelmet(app);
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoute);

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
