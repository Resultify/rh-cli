/** @module args */

import chalk from 'chalk'
import minimist from 'minimist'

const commands = [
  'info',
  'init',
  'browsers',
  'build',
  'watch',
  'fetch',
  'fetchModules',
  'upload',
  'cleanUpload',
  'ciUpload',
  'validate',
  'lighthouse',
  'fields',
  'fetchDb',
  'uploadDb'
]

const argOptions = {
  boolean: [
    'verbose',
    'version',
    'help',
    'debug'
  ],
  alias: {
    v: 'verbose',
    h: 'help',
    d: 'debug'
  },
  stopEarly: true,
  '--': true,
  unknown: (/** @type {any} */ arg) => {
    if (commands.includes(arg)) {
      return true
    } else {
      console.error(`${chalk.red('Unknown')} command: ${arg}`)
      process.exit(1)
    }
  }
}

/**
 * #### parse cli args
 * @returns {minimist.ParsedArgs} cli args
 */
function parseArgs () {
  return minimist(process.argv.slice(2), argOptions)
}

export { parseArgs }
