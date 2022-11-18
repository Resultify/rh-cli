import chalk from 'chalk'

/**
 * @summary Custom error wrapper
 * @param {string} [msg] - error message
 * @param {Object} [error] - error
 * @returns undefined
 * @throws error
 */
function customError (msg, error) {
  console.error(`${chalk.red('Error:')} ${msg}\n`)
  if (error && process.env.RH_MODE === 'debug') {
    console.error(error)
  }
  process.exit(1)
}

export { customError }
