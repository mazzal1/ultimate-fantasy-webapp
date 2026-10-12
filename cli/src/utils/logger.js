const colors = {
  reset: '\u001b[0m',
  blue: '\u001b[34m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  red: '\u001b[31m',
};

function log(color, label, message) {
  console.log(`${color}${label}${colors.reset} ${message}`);
}

export const logger = {
  info(message) {
    log(colors.blue, '[info]', message);
  },
  success(message) {
    log(colors.green, '[ok]', message);
  },
  warn(message) {
    log(colors.yellow, '[warn]', message);
  },
  error(message) {
    log(colors.red, '[error]', message);
  },
};
