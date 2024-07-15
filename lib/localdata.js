/// <reference path="./types/types.js" />
import path from 'node:path'
import dotenv from 'dotenv'
import { isFileDirExists, parseJson } from './utils/fs.js'
import { execa } from 'execa'
import { gitData } from './git/git.js'

const cwdPath = process.cwd()
const sysNpm = await execa('npm', ['--version'])
const sysGit = await execa('git', ['--version'])

/**
 * #### Get .env variables
 * @async
 * @private
 * @returns {Promise<Array<string>|boolean>} env variables|false
 */
async function getLocalEnv () {
  const env = dotenv.config({ path: [`${process.env.HOME}/.rh/.env.root`, `${cwdPath}/.env`] }).parsed
  // if env not empty Object
  if (env !== undefined && Object.keys(env).length !== 0) {
    return Object.keys(env)
  } else {
    return false
  }
}

/**
 * #### Get package.json data
 * @async
 * @private
 * @returns {Promise<THEME_PACKAGE_JSON|boolean>} package.json|false
 */
async function getThemePkgJsonData () {
  if (await isFileDirExists(`${cwdPath}/package.json`)) {
    const packageJson = await parseJson(`${cwdPath}/package.json`)
    return {
      name: packageJson.name,
      version: packageJson.version,
      engines: {
        node: packageJson.engines.node,
        npm: packageJson.engines.npm
      },
      hubspotCmsLib: packageJson.devDependencies['@resultify/hubspot-cms-lib'],
      cmslib: packageJson.cmslib
    }
  } else {
    return false
  }
}

/**
 * #### Get theme.json data
 * @async
 * @private
 * @returns {Promise<THEME_JSON|boolean>} package.json|false
 */
async function getThemeJsonData () {
  if (await isFileDirExists(`${cwdPath}/theme/theme.json`)) {
    const themeJson = await parseJson(`${cwdPath}/theme/theme.json`)
    return {
      version: themeJson.version,
      label: themeJson.label,
      name: themeJson.name,
      parentTheme: themeJson.extends || false,
      hiddenModules: themeJson.hidden_modules
    }
  } else {
    return false
  }
}

/**
 * #### collect local data
 * @async
 * @param {CLI_PACKAGE_JSON} cliPackageJson - cli package.json data
 * @returns {Promise<LOCALDATA>} local data
 */
async function collectLocalData (cliPackageJson) {
  const data = {
    cli: {
      name: cliPackageJson.name,
      version: cliPackageJson.version,
      engines: {
        node: cliPackageJson.engines.node,
        npm: cliPackageJson.engines.npm
      }
    },
    system: {
      node: process.version,
      npm: sysNpm.stdout,
      git: sysGit.stdout
    },
    cwd: {
      path: cwdPath,
      dir: path.parse(cwdPath).dir,
      base: path.parse(cwdPath).base,
      name: path.parse(cwdPath).name
    },
    git: await gitData(),
    package: await getThemePkgJsonData(),
    theme: await getThemeJsonData(),
    env: await getLocalEnv()
  }
  return data
}

export { collectLocalData }
