/// <reference path="./types/types.js" />
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
import { init } from './cmd/init.js'
import { browsers } from './cmd/browsers.js'
import { help } from './args/help.js'
import { debug } from './args/debug.js'
import { debugV } from './args/debug-verbose.js'
import chalk from 'chalk'
import { onExit } from 'signal-exit'
import dotenv from 'dotenv'
import { addUserRootDotEnvFileIfNotExists } from './utils/env.js'
await addUserRootDotEnvFileIfNotExists()
dotenv.config({ override: true, path: [`${process.env.HOME}/.rh/.env.root`, '.env'] })

// handle exit signals properly
// handle ctrl+c
onExit((code) => {
  if (code !== null) {
    process.exit(code)
  } else {
    process.exit(0)
  }
}, { alwaysLast: true })

// required general checks
await checkIfBinExists('node')
await checkIfBinExists('npm')
await checkIfBinExists('git')
const cliPackageJson = await parseCliPackageJson()
await checkNode(cliPackageJson)

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
async function cliInit () {
  try {
    if (args.debug) {
      // init debug mode environment
      process.env.RH_MODE = 'debug'
      if (args.verbose) {
        debugV(data, args)
      } else {
        debug(data, args)
      }
    }
    if (args.help) {
      // show help
      help(data)
      process.exit(0)
    }
    if (args.version) {
      // show version
      console.log(`v${data.cli.version}`)
      process.exit(0)
    }
    switch (args._[0]) {
      case 'info':
        // show info about the current project
        await info(data)
        break
      case 'init':
        await init(data)
        break
      case 'browsers':
        await browsers(data)
        break
      case 'upload':
        // upload files to HubSpot
        checkIsHubSpotCmsTheme(data)
        checkCliToThemeCompatibility(data, cliPackageJson)
        await import('@resultify/hubspot-cms-lib/upload')
        break
      case 'cleanUpload':
        // clean and upload files to HubSpot
        checkIsHubSpotCmsTheme(data)
        checkCliToThemeCompatibility(data, cliPackageJson)
        await import('@resultify/hubspot-cms-lib/cleanUpload')
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
        if (process.env.RH_MODE !== 'debug') {
          info(data)
        }
        break
    }
  } catch (error) {
    if (error && process.env.RH_MODE === 'debug') {
      console.error(`${chalk.bold.red('Error:')} ${error.message}`)
      console.error(error)
    } else {
      console.error(`${chalk.bold.red('Error:')} ${error.message}`)
    }
  }
}

export { cliInit }
