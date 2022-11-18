import chalk from 'chalk'
import dotenv from 'dotenv'
import { isFileDir } from '@resultify/hubspot-tools-theme-lib/lib/utils/fs.js'

/**
 * @summary Get .env config
 * @async
 * @private
 * @returns {Promise<Object|boolean>} .env|false
 */
async function getLocalEnv () {
  if (await isFileDir(`${process.cwd()}/.env`)) {
    return dotenv.config()
  } else {
    return false
  }
}

/**
 * @summary Show debug info with --debug flag
 * @async
 * @param {Object} [data] - cli data (localstorage)
 * @param {Object} [args] - cli args
 * @returns undefined
 */
async function showDebugInfo (data, args) {
  console.log(`\n${chalk.magenta('●─────')} General debug info [START]`)
  console.log(`${chalk.blue('Local .env')}`)
  await getLocalEnv() && console.log(await getLocalEnv())
  console.log(`${chalk.blue('Data')}`)
  data && console.log(data)
  console.log(`${chalk.blue('Arguments')}`)
  args && console.log(args)
  console.log(`${chalk.magenta('─────●')} General debug info [END]\n`)
}

export { showDebugInfo }
