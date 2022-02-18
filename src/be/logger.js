const { bold, red, green, grey } = require('chalk');

module.exports = class Logger {
  constructor(id) {
    this.id = id;
    this.b = bold;
  }

  log = (...props) => {
    console.log.apply(null, [green('I'), grey(this.id), ...props]);
  };
  err = (...props) => {
    console.log.apply(null, [red('E'), red(this.id), ...props]);
  };
};
