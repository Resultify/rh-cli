import * as TYPES from '../types/types.js' // eslint-disable-line
import chalk from 'chalk'
import minimist from 'minimist' // eslint-disable-line

/**
 * @ignore
 * @typedef {TYPES.LOCALDATA} LOCALDATA {@link LOCALDATA}
 */

/**
 * #### show debug info
 * @memberof OPTIONS
 * @param {LOCALDATA} [data] - debug data
 * @param {minimist.ParsedArgs} [args] - debug info
 * @returns undefined
 */
function debug (data, args) {
  process.env.RH_MODE = 'debug'
  console.log(chalk.bold.magenta('●─────[debug-start]─────●'))
  console.log(`${chalk.blue('CLI Arguments')}`)
  args && console.log(args)
  console.log(`${chalk.blue('Local data')}`)
  data && console.log(data)
  console.log(chalk.bold.magenta('●─────[debug-end]─────●\n'))
}

export { debug }
