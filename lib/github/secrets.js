import * as TYPES from '../types/types.js' // eslint-disable-line
import { request } from '@octokit/request'
import chalk from 'chalk'
import ora from 'ora'
import _sodium from 'libsodium-wrappers'

/**
* @ignore
* @typedef {TYPES.LOCALDATA} LOCALDATA {@link LOCALDATA}
*/

/**
 * #### add repository secrets
 * @async
 * @memberof GITHUB
 * @param {LOCALDATA} data - data object
 * @returns undefined
 */
async function addRepositorySecrets (data) {
  const spinner = ora('Add repository secrets').start()
  try {
    const { hubspotPortalIdSecret, hubspotPersonalAccessKeySecret, publicKeyId } = await encryptSecrets(data)
    await request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      },
      owner: data.prompts?.repoFromTmpl?.newRepoOwner || '',
      repo: data.prompts?.repoFromTmpl?.newRepoName || '',
      secret_name: 'HUBSPOT_PORTAL_ID',
      encrypted_value: hubspotPortalIdSecret,
      key_id: publicKeyId
    })
    await request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      },
      owner: data.prompts?.repoFromTmpl?.newRepoOwner || '',
      repo: data.prompts?.repoFromTmpl?.newRepoName || '',
      secret_name: 'HUBSPOT_PERSONAL_ACCESS_KEY',
      encrypted_value: hubspotPersonalAccessKeySecret,
      key_id: publicKeyId
    })
    spinner.succeed()
  } catch (error) {
    spinner.fail()
    console.error(`${chalk.red('Error:')} ${error.message}`)
    if (process.env.RH_MODE === 'debug') {
      console.error(error)
    }
    process.exit(1)
  }
}

/**
 * #### get a repository public key
 * @async
 * @private
 * @memberof GITHUB
 * @param {LOCALDATA} data - data object
 * @returns {Promise<{publicKey: string, publicKeyId: string}>} - public key
 */
async function getRepositoryPublicKey (data) {
  const spinner = ora('Get repository public key').start()
  try {
    const publicKeyResponce = await request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      },
      owner: data.prompts?.repoFromTmpl?.newRepoOwner || '',
      repo: data.prompts?.repoFromTmpl?.newRepoName || ''
    })
    const publicKey = publicKeyResponce.data.key
    const publicKeyId = publicKeyResponce.data.key_id
    spinner.succeed()
    return { publicKey, publicKeyId }
  } catch (error) {
    spinner.fail()
    console.error(`${chalk.red('Error:')} ${error.message}`)
    if (process.env.RH_MODE === 'debug') {
      console.error(error)
    }
    process.exit(1)
  }
}

/**
 * #### Encrypt secrets for the REST API
 * @async
 * @private
 * @memberof GITHUB
 * @param {LOCALDATA} data - data object
 * @returns {Promise<{hubspotPortalIdSecret: string, hubspotPersonalAccessKeySecret: string, publicKeyId: string}>} - encrypted secrets and public key ID
 */
async function encryptSecrets (data) {
  const spinner = ora('Encrypting secret').start()
  try {
    const hubspotPortalIdSecretVal = data.prompts?.repoFromTmpl?.repoSecrets?.hubspotPortalId || ''
    const hubspotPersonalAccessKeySecretVal = data.prompts?.repoFromTmpl?.repoSecrets?.hubspotPersonalAccessKey || ''
    const publicKey = await getRepositoryPublicKey(data)
    await _sodium.ready
    const sodium = _sodium

    // Convert the secret and key to a Uint8Array.
    const binkey = sodium.from_base64(publicKey.publicKey, sodium.base64_variants.ORIGINAL)
    const binHubspotPortalIdSecret = sodium.from_string(hubspotPortalIdSecretVal)
    const binHubspotPersonalAccessKeySecret = sodium.from_string(hubspotPersonalAccessKeySecretVal)

    // Encrypt the secret using libsodium
    const encryptHubspotPortalIdSecret = sodium.crypto_box_seal(binHubspotPortalIdSecret, binkey)
    const encryptHubspotPersonalAccessKeySecret = sodium.crypto_box_seal(binHubspotPersonalAccessKeySecret, binkey)

    // Convert the encrypted Uint8Array to Base64
    const hubspotPortalIdSecret = sodium.to_base64(encryptHubspotPortalIdSecret, sodium.base64_variants.ORIGINAL)
    const hubspotPersonalAccessKeySecret = sodium.to_base64(encryptHubspotPersonalAccessKeySecret, sodium.base64_variants.ORIGINAL)
    spinner.succeed()
    return { hubspotPortalIdSecret, hubspotPersonalAccessKeySecret, publicKeyId: publicKey.publicKeyId }
  } catch (error) {
    spinner.fail()
    console.error(`${chalk.red('Error:')} ${error.message}`)
    if (process.env.RH_MODE === 'debug') {
      console.error(error)
    }
    process.exit(1)
  }
}

export { addRepositorySecrets }
