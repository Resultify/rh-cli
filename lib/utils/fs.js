import fsPromises from 'fs/promises'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/**
 * @summary check if file/dir exists
 * @async
 * @param {string} path - file/dir path
 * @returns {Promise<boolean>}
 */
async function isFileDir (path) {
  try {
    await fsPromises.stat(path)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    }
    console.error(error)
  }
}

/**
 * @summary Import theme.json
 * @async
 * @private
 * @param {string} path - file/dir path
 * @returns {Promise<Object|boolean>} theme.json|false
 */
async function importThemeJson (path) {
  if (await isFileDir(`${path}/theme/theme.json`)) {
    return require(`${path}/theme/theme.json`)
  } else {
    return false
  }
}

/**
 * @summary Import package.json
 * @async
 * @private
 * @param {string} path - file/dir path
 * @returns {Promise<Object|boolean>} package.json|false
 */
async function importPackageJson (path) {
  if (await isFileDir(`${path}/package.json`)) {
    return require(`${path}/package.json`)
  } else {
    return false
  }
}

export { importPackageJson, importThemeJson, isFileDir }
