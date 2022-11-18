import { execa } from 'execa'
import { importThemeJson, importPackageJson } from './utils/fs.js'

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
