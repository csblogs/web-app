import express         from 'express';
import exphbs          from 'express-handlebars';
import configureHelmet from './security/configure-helmet';
import log             from './log';
import requestLogger   from './log/request-logger';
import indexRoute      from './routes/index';
import path            from 'path';

const app = express();
const port = process.env.PORT;

configureHelmet(app);
app.use(requestLogger);

app.use('/', indexRoute);

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.listen(port, () => {
  log.info({ port }, 'CSBlogs web app now running');
});
