import express from 'express';
import configureHelmet from './security/configure-helmet';
import log from './log';
import requestLogger from './log/request-logger';
import indexRoute from './routes/index';

const app = express();
configureHelmet(app);
app.use(requestLogger);

const port = process.env.PORT;

app.use('/', indexRoute);

app.listen(port, () => {
  log.info({ port }, 'CSBlogs web app now running');
});
