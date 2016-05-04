import log from '../log';

export default function requestLogger(req, res, next) {
  if (!req.originalUrl.startsWith('/public/')) {
    log.info({
      ip: req.ip,
      protocol: req.protocol,
      secure: req.secure,
      method: req.method,
      url: req.originalUrl
    }, 'Request received');
  }
  next();
}
