/// <reference path="../types/types.js" />
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

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

/**
 * @summary write json file
 * @async
 * @param {string} path - file path
 * @param {string} data - data to write
 * @returns undefined
 */
async function writeJson (path, data) {
  try {
    if (await isFileDirExists(path)) {
      await fsPromises.writeFile(path, JSON.stringify(data, null, 2) + '\n')
    }
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * @summary remove folder/file recursively
 * @async
 * @param {string} path - file path
 * @returns undefined
 */
async function removePath (path) {
  try {
    if (await isFileDirExists(path)) {
      await fsPromises.rm(path, { recursive: true, force: true })
    }
  } catch (error) {
    throw new Error(error)
  }
}

export { parseCliPackageJson, parseJson, isFileDirExists, writeJson, removePath }
