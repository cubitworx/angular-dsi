var path = require('path');

const EVENT = process.env.npm_lifecycle_event || '';
const ROOT = path.resolve(__dirname, '..');

function hasNpmFlag(flag) {
  return EVENT.includes(flag);
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server/.exec(process.argv[1]));
}

exports.hasNpmFlag = hasNpmFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;
