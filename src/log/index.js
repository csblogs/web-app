import bunyan from 'bunyan';

const log = bunyan.createLogger({
  name: 'csblogs-web-app'
});

if ((process.env.npm_lifecycle_script === 'istanbul cover ./node_modules/.bin/_mocha -- --compilers js:babel-register --require tests/chai-config.js --recursive ./tests/**/*.tests.js')) {
  // Running in test mode. Prevent logging to stdout (makes mocha output easier to read).
  log.streams = [];
}

export default log;
