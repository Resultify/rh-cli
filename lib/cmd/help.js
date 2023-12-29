// import chalk from 'chalk'

/**
 * @summary Show cli info
 * @async
 * @memberof CLIcommands
 * @param {Object} data - cli data
 * @returns undefined
 */
async function showHelp (data) {
  console.log('rh [--help | -h] [--debug | -d] <command>\n')
  console.log('Usage:\n')
  console.log(`rh --versio
rh --debug               test
rh <command> --debug     test
rh info                  test
rh help|--help           test`)
  process.exit(0)
}

export { showHelp }
