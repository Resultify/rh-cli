import * as TYPES from '../types/types.js' // eslint-disable-line
import { request } from '@octokit/request'
import chalk from 'chalk'
import ora from 'ora'

/**
* @ignore
* @typedef {TYPES.LOCALDATA} LOCALDATA {@link LOCALDATA}
* @typedef {TYPES.GITHUB_REPO_SETTINGS} GITHUB_REPO_SETTINGS {@link GITHUB_REPO_SETTINGS}
* @typedef {TYPES.GITHUB_BRANCH_PROTECTION_SETTINGS} GITHUB_BRANCH_PROTECTION_SETTINGS {@link GITHUB_BRANCH_PROTECTION_SETTINGS}
*/

/**
 * #### create a repository using a template
 * @async
 * @memberof GITHUB
 * @param {LOCALDATA} data - data object
 * @returns undefined
 */
async function createGithubRepoWithTemplate (data) {
  const spinner = ora('Create new repository from template').start()
  try {
    // check if the repository already exists
    const repoExists = await isGithubRepoExists(data.prompts?.githubRepoFromTmpl?.newRepoOwner || '', data.prompts?.githubRepoFromTmpl?.newRepoName || '')
    if (repoExists) {
      spinner.warn('Repository already exists.')
      process.exit(0)
    }
    // create a new repository from a template
    await request('POST /repos/{template_owner}/{template_repo}/generate', {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      },
      template_owner: data.prompts?.githubRepoFromTmpl?.templateRepoOwner || '',
      template_repo: data.prompts?.githubRepoFromTmpl?.templateRepoName || '',
      owner: data.prompts?.githubRepoFromTmpl?.newRepoOwner || '',
      name: data.prompts?.githubRepoFromTmpl?.newRepoName || '',
      description: data.prompts?.githubRepoFromTmpl?.newRepoLabel,
      include_all_branches: false,
      private: data.prompts?.githubRepoFromTmpl?.isPrivate
    })
    await waitForGithubRepo(data.prompts?.githubRepoFromTmpl?.newRepoOwner || '', data.prompts?.githubRepoFromTmpl?.newRepoName || '')
    await waitForGithubRepoNotEmpty(data.prompts?.githubRepoFromTmpl?.newRepoOwner || '', data.prompts?.githubRepoFromTmpl?.newRepoName || '')
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
 * #### update a repository settings
 * @async
 * @memberof GITHUB
 * @param {LOCALDATA} data - data object
 * @param {TYPES.GITHUB_REPO_SETTINGS} repoSettings - repository settings
 * @returns undefined
 */
async function updateGithubRepoSettings (data, repoSettings) {
  const spinner = ora('Update repository settings').start()
  try {
    await request('PATCH /repos/{owner}/{repo}', {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      },
      ...repoSettings
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
 * #### update branch protection settings
 * @async
 * @memberof GITHUB
 * @param {LOCALDATA} data - data object
 * @param {GITHUB_BRANCH_PROTECTION_SETTINGS} branchSettings - branch settings
 * @returns undefined
 */
async function updateGithubBranchProtection (data, branchSettings) {
  const spinner = ora('Branch protection').start()
  try {
    await request('PUT /repos/{owner}/{repo}/branches/{branch}/protection', {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      },
      ...branchSettings
    })
    spinner.succeed()
  } catch (error) {
    if (error.status === 403) {
      spinner.warn('Branch protection settings are not updated.')
      console.warn(`${error.message}`)
    } else {
      spinner.fail()
      console.error(`${chalk.red('Error:')} ${error.message}`)
      if (process.env.RH_MODE === 'debug') {
        console.error(error)
      }
      process.exit(1)
    }
  }
}

/**
 * #### wait for a repository to be created
 * @async
 * @param {string} owner - owner name
 * @param {string} repo - repository name
 * @returns undefined
 */
async function waitForGithubRepo (owner, repo) {
  const startTime = Date.now()
  while (true) {
    try {
      await request('GET /repos/{owner}/{repo}', {
        owner,
        repo,
        headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      })
      break
    } catch (error) {
      if (error.status !== 404) {
        throw error
      }
      // Wait for 3 seconds before trying again
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
    // Check if 20 seconds have passed
    if (Date.now() - startTime > 20000) {
      throw new Error('Timeout waiting for repository creation')
    }
  }
}

/**
 * #### wait for a repository to be pupulated with files
 * @async
 * @param {string} owner - owner name
 * @param {string} repo - repository name
 * @returns undefined
 */
async function waitForGithubRepoNotEmpty (owner, repo) {
  const startTime = Date.now()
  while (true) {
    try {
      const { data } = await request('GET /repos/{owner}/{repo}/contents', {
        owner,
        repo,
        headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      })
      if (data.length > 0) {
        break
      }
      // Wait for 3 second before trying again
      await new Promise(resolve => setTimeout(resolve, 3000))
    } catch (error) {
      if (error.status !== 404) {
        throw error
      }
      // Wait for 3 second before trying again
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
    // Check if 20 seconds have passed
    if (Date.now() - startTime > 20000) {
      throw new Error('Timeout waiting for repository to be populated')
    }
  }
}

/**
 * #### check if a repository exists
 * @async
 * @param {string} owner - owner name
 * @param {string} repo - repository name
 * @returns undefined
 */
async function isGithubRepoExists (owner, repo) {
  try {
    await request('GET /repos/{owner}/{repo}', {
      owner,
      repo,
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    })
    return true
  } catch (error) {
    if (error.status === 404) {
      return false
    }
    throw error
  }
}

export {
  createGithubRepoWithTemplate,
  updateGithubRepoSettings,
  updateGithubBranchProtection,
  waitForGithubRepo,
  waitForGithubRepoNotEmpty,
  isGithubRepoExists
}
