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
  console.log(chalk.bold.magenta('●─────[debug-start]─────●'))
  console.log(`${chalk.bold('rh-cli: v')}${data?.cli.version}`)
  console.log(`${chalk.bold('local-node: ')}${chalk.cyan(data?.system.node)}`)
  console.log(`${chalk.bold('local-npm: ')}${chalk.cyan(data?.system.npm)}`)
  console.log(`${chalk.bold(data?.system.git)}`)
  console.log(`${chalk.bold('isGirRepo: ')}${chalk.yellow(data?.git.isRepo)}`)
  console.log(`${chalk.bold('cwd: ')}${chalk.green(data?.cwd.path)}`)
  if (data?.package && typeof data?.package === 'object') {
    console.log(`${chalk.bold('package.json.name: ')}${chalk.cyan(data?.package.name)}`)
  } else {
    console.log(`${chalk.bold('package.json: ')}${chalk.yellow(data?.package)}`)
  }
  if (data?.package && typeof data?.theme === 'object') {
    console.log(`${chalk.bold('theme.json.name: ')}${chalk.cyan(data?.theme.name)}`)
  } else {
    console.log(`${chalk.bold('theme.json: ')}${chalk.yellow(data?.theme)}`)
  }
  console.log(chalk.bold.magenta('●─────[debug-end]─────●\n'))
}

export { debug }
