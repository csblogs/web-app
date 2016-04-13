import express from 'express';
import configureHelmet from './security/configure-helmet';
import log from './log';
import requestLogger from './log/request-logger';


const app = express();
configureHelmet(app);
app.use(requestLogger);

const port = process.env.PORT;

app.listen(port, () => {
  log.info({ port }, 'CSBlogs web app now running');
});
