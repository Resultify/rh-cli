/// <reference path="../types/types.js" />
import chalk from 'chalk'

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
 * @param {LOCALDATA} data - env variables
 * @returns {string} theme info
 */
function possibleCmds (data) {
  const cmds = []
  if (Array.isArray(data.env) && data.env.includes('GITHUB_TOKEN')) {
    cmds.push('rh init')
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
 * @returns undefined
 */
function info (data) {
  console.log(`Folder name: ${chalk.cyan(data.cwd.name)}
Git repository: ${data.git.isRepo || chalk.red('not found')}
${themeInfo(data)}
`)
  console.log(possibleCmds(data))
}

export { info }
