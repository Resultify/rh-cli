import * as TYPES from '../types/types.js' // eslint-disable-line
import chalk from 'chalk'

/**
 * @ignore
 * @typedef {TYPES.LOCALDATA} LOCALDATA {@link LOCALDATA}
 */

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
 * #### Show info about the current project
 * @param {LOCALDATA} data - local data
 * @returns undefined
 */
function info (data) {
  console.log(`Folder name: ${chalk.cyan(data.cwd.name)}
Git repository: ${data.git.isRepo || chalk.red('not found')}
${themeInfo(data)}
`)
}

export { info }
