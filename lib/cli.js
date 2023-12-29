// import { checkNode } from '@resultify/hubspot-cms-lib/lib/utils/check.js'
import { parseArgs, checkIfMoreThanOneArg } from './arg/arg.js'
import { localstorage } from './local-storage.js'
import { showInfo as info } from './cmd/info.js'
import { showHelp } from './arg/help.js'
import { showDebugInfo } from './arg/debug.js'
import { gitInfo } from './git/git.js'
import { checkIfSsh, checkIfBinExists } from './shell/shell.js'

await checkIfSsh()
await checkIfBinExists('git')
await checkIfBinExists('node')
await checkIfBinExists('npm')
// checkNode()

// cli data localstorage
let data = await localstorage()

// parse args
const args = parseArgs()
checkIfMoreThanOneArg(args)
const nonFlagArg = args._

/**
 * @summary init cli
 * @async
 * @returns undefined
 */
async function init () {
  data = { ...data, ...await gitInfo(data) }
  if (args['--debug']) {
    process.env.RH_MODE = 'debug'
    await showDebugInfo(data, args)
  }
  if (args['--version']) {
    console.log('version 4')
    process.exit(0)
  }

  if (nonFlagArg[0] === 'help' || args['--help']) {
    await showHelp(data)
  } else if (nonFlagArg[0] === 'info') {
    await info(data)
  } else {
    if (!args._.length) {
      await showHelp(data)
    }

    console.log(args)
    console.log(nonFlagArg[0])
    console.log(args._.length)
    console.log(`unknown or unexpected option: ${nonFlagArg[0]}${args[0]}`)
    process.exit(1)
  }
}

export { init }
