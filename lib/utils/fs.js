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

export { importPackageJson, importThemeJson, isFileDir }
