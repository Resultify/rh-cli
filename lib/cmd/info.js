/// <reference path="../types/types.js" />
import chalk from 'chalk'
import { isFileDirExists } from '../utils/fs.js'

/**
 * #### theme info
 * @private
 * @param {LOCALDATA} data - env variables
 * @returns {string} theme info
 */
function themeInfo (data) {
  if (data.theme && data.theme instanceof Object && data.theme.name) {
    return `HubSpotCMS theme: ${chalk.green(data.theme.name)}`
  } else {
    return `HubSpotCMS theme: ${chalk.red('not found')}`
  }
}

/**
 * #### possible commands to run
 * @private
 * @async
 * @param {LOCALDATA} data - env variables
 * @returns {Promise<string>} possible commands
 */
async function possibleCmds (data) {
  const cmds = []
  cmds.push('rh init')
  if (await isFileDirExists(`${data.cwd.path}/.browserslistrc`)) {
    cmds.push('rh browsers')
  }
  if (data.theme && data.theme instanceof Object && data.theme.name) {
    cmds.push('rh upload', 'rh fetch', 'rh fetchModules', 'rh build', 'rh watch', 'rh validate', 'rh fields', 'rh fetchDb', 'rh uploadDb', 'rh lighthouse')
  }
  if (cmds.length > 0) {
    return 'Possible commands to run:\n' + cmds.join('\n')
  } else {
    return ''
  }
}

/**
 * #### Show info about the current project
 * @param {LOCALDATA} data - local data
 * @async
 * @returns undefined
 */
async function info (data) {
  console.log(`Folder name: ${chalk.cyan(data.cwd.name)}
Git repository: ${data.git.isRepo || chalk.red('not found')}
${themeInfo(data)}
`)
  console.log(await possibleCmds(data))
}

export { info }
