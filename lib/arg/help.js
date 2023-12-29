// import chalk from 'chalk'
// import path from 'path'
// import fs from 'fs'
// import { env } from 'node:process'
// import { createRequire } from 'module'
// const require = createRequire(import.meta.url)
// console.log(require('../../package.json'))
// env.RRRR = '1.0.0'

/**
 * @summary Show help info
 * @async
 * @memberof CLIcommands
 * @param {Object} data - cli data
 * @returns undefined
 */
async function showHelp (data) {
  console.log('\nUsage: rh [OPTIONS] COMMAND\n')
  console.log(`Resultify HubSpot CMS CLI ${data.rhcli.version}\n`)
  console.log(`Options:
-v, --version  Print version information and quit
-d, --debug    Enable debug mode
-h, --help     Print general help information and quit
  `)
  console.log(`Commands:
rh info        Print CLI info and quit
  `)
  process.exit(0)
}

export { showHelp }
