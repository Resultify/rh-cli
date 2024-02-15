import * as TYPES from '../types/types.js' // eslint-disable-line
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/**
 * @ignore
 * @typedef {TYPES.CLI_PACKAGE_JSON} CLI_PACKAGE_JSON {@link CLI_PACKAGE_JSON}
 */

/**
 * #### check if file/dir exists
 * @async
 * @memberof UTILS
 * @param {string} path - file/dir path
 * @returns {Promise<boolean>}
 */
async function isFileDirExists (path) {
  try {
    await fsPromises.stat(path)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    }
    throw new Error(error)
  }
}

/**
 * #### parse CLI package.json
 * @async
 * @memberof UTILS
 * @returns {Promise<CLI_PACKAGE_JSON>} cli package.json
 */
async function parseCliPackageJson () {
  const filePath = path.resolve(url.fileURLToPath(import.meta.url), '../../../package.json')
  const packageJsonFile = require(filePath)
  return packageJsonFile
}

/**
 * @summary parse .json file
 * @async
 * @private
 * @param {string} path - file.json path
 * @returns {Promise<any|boolean>} file.json|false
 */
async function parseJson (path) {
  if (await isFileDirExists(path)) {
    return require(path)
  } else {
    return false
  }
}

export { parseCliPackageJson, parseJson, isFileDirExists }
