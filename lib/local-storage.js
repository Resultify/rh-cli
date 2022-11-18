import { execa } from 'execa'
import { isFileDir } from '@resultify/hubspot-tools-theme-lib/lib/utils/fs.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/**
 * @summary Import theme.json
 * @async
 * @private
 * @returns {Promise<Object|boolean>} theme.json|false
 */
async function importThemeJson () {
  if (await isFileDir(`${process.cwd()}/theme/theme.json`)) {
    return require(`${process.cwd()}/theme/theme.json`)
  } else {
    return false
  }
}

/**
 * @summary Import package.json
 * @async
 * @private
 * @returns {Promise<Object|boolean>} package.json|false
 */
async function importPackageJson () {
  if (await isFileDir(`${process.cwd()}/package.json`)) {
    return require(`${process.cwd()}/package.json`)
  } else {
    return false
  }
}

/**
 * @summary data locals torage
 * @typedef LOCAL_STORAGE
 * @type {object}
 * @property {object} git
 * @property {object} package
 * @property {object} theme
 * @property {object} github
 * @property {object} prompts
 * @property {object} system
 * @property {object} tmp
 */

/**
 * @summary CLI data localstorage
 * @description Save all data needed for a program and make it accessible through all functions
 * @async
 * @returns {Promise<LOCAL_STORAGE>} portal name|names
 */
async function localstorage () {
  return {
    git: {
    },
    package: await importPackageJson(),
    theme: await importThemeJson(),
    github: {
      auth: 'sucsess'
    },
    prompts: {},
    system: {
      node: process.version,
      npm: await (await execa('npm', ['--version'])).stdout,
      git: await (await execa('git', ['--version'])).stdout
    },
    tmp: {}
  }
}

export { localstorage }
