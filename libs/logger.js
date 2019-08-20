import dateFormat from 'dateformat';
import colors from 'colors';

const Logger = function Logger(name, pid) {
  this._name = name;
  this._pid = pid;
};

Logger.prototype.green = function success(message) {
  console.log(
    `${getDateString()} [${this._name}] [${this._pid}] ` + colors.green('[+] ' + message)
  );
};

Logger.prototype.red = function error(message) {
  console.log(`${getDateString()} [${this._name}] [${this._pid}] ` + colors.red('[x] ' + message));
};

Logger.prototype.blue = function won(message) {
  console.log(`${getDateString()} [${this._name}] [${this._pid}] ` + colors.blue('[$] ' + message));
};

Logger.prototype.normal = function info(message) {
  console.log(`${getDateString()} [${this._name}] [${this._pid}] [#] ${message}`);
};

Logger.prototype.yellow = function caution(message) {
  console.log(
    `${getDateString()} [${this._name}] [${this._pid}] ` + colors.yellow('[?] ' + message)
  );
};

function getDateString() {
  return '[' + dateFormat(new Date(), 'HH:MM:ss.l') + ']';
}

export default (name, pid) => {
  return new Logger(name, pid);
};
