const { bold, red, green, grey } = require('chalk');

const logStack = [];

module.exports = class Logger {
  constructor(id) {
    this.id = id;
    this.b = bold;
  }

  log = (...props) => {
    console.log.apply(null, [green('I'), grey(this.id), ...props]);
    logStack.push(`I [${this.id}] ${props.map(toString).join(' ')}`);
  };
  err = (...props) => {
    console.log.apply(null, [red('E'), red(this.id), ...props]);
    logStack.push(`I [${this.id}] ${props.map(toString).join(' ')}`);
  };
};

module.exports.persist = () => {};
