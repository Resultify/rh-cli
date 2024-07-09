/** @module lib/utils/env */

import fsPromises from 'fs/promises'
import { isFileDirExists } from './fs.js'

const ROOT_DOTENV_FILE_DATA_TMPL = `# Define a name of your Hubspot portal prefixed by hub_ and add associated personal access key to it.
# hub_sandbox=personal-access-key-for-this-sandbox
# ...
# Add a GitHub (classic) Personal Access Token to work with some functions for "rh" CLI
# Only full repo scope is required
# GITHUB_TOKEN=your-classic-personal-access-token
`

/**
 * #### Create .env file if not exists in the user's root directory
 * @async
 * @private
 * @returns undefined
 */
async function addUserRootDotEnvFileIfNotExists () {
  // create .rh directory if not exists
  if (!await isFileDirExists(`${process.env.HOME}/.rh`)) {
    try {
      await fsPromises.mkdir(`${process.env.HOME}/.rh`)
    } catch (error) {
      console.error(error)
    }
  }
  // create .env.root file if not exists
  if (!await isFileDirExists(`${process.env.HOME}/.rh/.env.root`)) {
    try {
      await fsPromises.appendFile(`${process.env.HOME}/.rh/.env.root`, ROOT_DOTENV_FILE_DATA_TMPL)
    } catch (error) {
      console.error(error)
    }
  }
}

export { addUserRootDotEnvFileIfNotExists }
