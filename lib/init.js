import * as TYPES from './types/types.js' // eslint-disable-line
import { parseArgs } from './args/args.js'
import { parseCliPackageJson } from './utils/fs.js'
import {
  checkNode,
  checkIfBinExists,
  checkIsHubSpotCmsTheme,
  checkCliToThemeCompatibility
} from './utils/check.js'
import { collectLocalData } from './localdata.js'
import { info } from './cmd/info.js'
import { help } from './args/help.js'
import { debug } from './args/debug.js'
import chalk from 'chalk'

// required general checks
await checkIfBinExists('node')
await checkIfBinExists('npm')
await checkIfBinExists('git')
const cliPackageJson = await parseCliPackageJson()
await checkNode(cliPackageJson)

/**
 * @ignore
 * @typedef {TYPES.LOCALDATA} LOCALDATA {@link LOCALDATA}
 * @typedef {TYPES.CLI_PACKAGE_JSON} CLI_PACKAGE_JSON {@link CLI_PACKAGE_JSON}
 */

// parse args
const args = parseArgs()
// save local data
/**
 * #### local data
 * @type {LOCALDATA}
 */
const data = await collectLocalData(cliPackageJson)

/**
 * #### cli init
 * @async
 * @returns undefined
 */
async function init () {
  try {
    if (args.debug) {
      // init debug mode
      debug(data, args)
    } else if (args.help) {
      // show help
      help(data)
      process.exit(0)
    } else if (args.version) {
      // show version
      console.log(`v${data.cli.version}`)
      process.exit(0)
    }
    switch (args._[0]) {
      case 'info':
        // show info about the current project
        info(data)
        break
      case 'upload':
        // upload files to HubSpot
        checkIsHubSpotCmsTheme(data)
        checkCliToThemeCompatibility(data, cliPackageJson)
        await import('@resultify/hubspot-cms-lib/upload')
        break
      case 'fetch':
        // fetch files from HubSpot
        checkIsHubSpotCmsTheme(data)
        checkCliToThemeCompatibility(data, cliPackageJson)
        await import('@resultify/hubspot-cms-lib/fetch')
        break
      case 'fetchModules':
        // fetch modules from HubSpot
        checkIsHubSpotCmsTheme(data)
        checkCliToThemeCompatibility(data, cliPackageJson)
        await import('@resultify/hubspot-cms-lib/fetchModules')
        break
      case 'build':
        // build the project
        checkIsHubSpotCmsTheme(data)
        checkCliToThemeCompatibility(data, cliPackageJson)
        await import('@resultify/hubspot-cms-lib/build')
        break
      case 'watch':
        // watch the project
        checkIsHubSpotCmsTheme(data)
        checkCliToThemeCompatibility(data, cliPackageJson)
        await import('@resultify/hubspot-cms-lib/watch')
        break
      case 'validate':
        // validate the project
        checkIsHubSpotCmsTheme(data)
        checkCliToThemeCompatibility(data, cliPackageJson)
        await import('@resultify/hubspot-cms-lib/validate')
        break
      case 'lighthouse':
        // run lighthouse
        checkIsHubSpotCmsTheme(data)
        checkCliToThemeCompatibility(data, cliPackageJson)
        await import('@resultify/hubspot-cms-lib/lighthouse')
        break
      case 'fields':
        // compile fields.js to fields.json
        checkIsHubSpotCmsTheme(data)
        checkCliToThemeCompatibility(data, cliPackageJson)
        await import('@resultify/hubspot-cms-lib/fields')
        break
      case 'fetchDb':
        // fetch db from HubSpot
        checkIsHubSpotCmsTheme(data)
        await import('@resultify/hubspot-cms-lib/fetchDb')
        break
      case 'uploadDb':
        // upload db to HubSpot
        checkIsHubSpotCmsTheme(data)
        checkCliToThemeCompatibility(data, cliPackageJson)
        await import('@resultify/hubspot-cms-lib/uploadDb')
        break
      default:
        help(data)
        break
    }
  } catch (error) {
    if (error && process.env.RH_MODE === 'debug') {
      console.error(chalk.bold.red('Error:'))
      console.error(error)
    } else {
      console.error(`${chalk.bold.red('Error:')} ${error.message}`)
    }
  }
}

export { init }
