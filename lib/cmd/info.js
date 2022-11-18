import chalk from 'chalk'

/**
 * @summary Show cli info
 * @async
 * @memberof CLIcommands
 * @param {Object} data - cli data
 * @returns undefined
 */
async function showInfo (data) {
  console.log(`\n${chalk.blue('Info')}`)
  console.log(data)
  process.exit(0)
}

export { showInfo }
