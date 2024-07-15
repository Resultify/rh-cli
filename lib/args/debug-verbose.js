/// <reference path="../types/types.js" />
import chalk from 'chalk'
import minimist from 'minimist' // eslint-disable-line

/**
 * #### show debug info
 * @memberof OPTIONS
 * @param {LOCALDATA} [data] - debug data
 * @param {minimist.ParsedArgs} [args] - debug info
 * @returns undefined
 */
function debugV (data, args) {
  console.log(chalk.bold.magenta('●─────[debug-start]─────●'))
  console.log(`${chalk.blue('CLI Arguments')}`)
  args && console.log(args)
  console.log(`${chalk.blue('Local data')}`)
  data && console.log(data)
  console.log(chalk.bold.magenta('●─────[debug-end]─────●\n'))
}

export { debugV }
