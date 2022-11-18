import { execa } from 'execa'
import chalk from 'chalk'

/**
 * @summary Show custom shell cmd error msg
 * @memberof SHELL
 * @param {string} [msg] - custom msg
 * @param {Object} [error] - error obj
 * @returns undefined
 * @throws error
 */
function customExecError (msg, error) {
  const internalMsg = error.stderr ? error.stderr : error.stdout
  console.error(`${chalk.bold.red('Error:')} ${internalMsg}`)
  if (msg) {
    console.error(`${msg}\n`)
  }
  if (error && process.env.RH_MODE === 'debug') {
    console.error(error)
  }
  process.exit(1)
}

/**
 * @summary check if ssh added to ssh-agent (macOS)
 * @async
 * @memberof SHELL
 * @returns undefined
 * @throws error
 */
async function checkIfSsh () {
  try {
    await execa('ssh-add', ['-L'])
  } catch (error) {
    if (error.stdout === 'The agent has no identities.') {
      console.log(customExecError('Add key to ssh-agent and run the command again', error))
    } else {
      console.log(customExecError('SSH error', error))
    }
  }
}

/**
 * @summary Check if shell bin exists
 * @async
 * @memberof SHELL
 * @param {string} bin - env variables
 * @returns undefined
 * @throws error
 */
async function checkIfBinExists (bin) {
  try {
    await execa('which', [bin])
  } catch (error) {
    console.log(customExecError(`This script requires ${chalk.yellow(bin)} to be instaled`, error))
  }
}

export { checkIfSsh, checkIfBinExists }
