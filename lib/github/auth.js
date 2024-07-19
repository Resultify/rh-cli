/// <reference path="../types/types.js" />
import { request } from '@octokit/request'
import chalk from 'chalk'
import ora from 'ora'

/**
 * #### check github token is set in env
 * @memberof GITHUB
 * @returns undefined
 */
function checkGithubTokenEnv () {
  if (!process.env.GITHUB_TOKEN) {
    console.warn(`${chalk.red('Warning:')} No GitHub token found.`)
    console.warn(`Add ${chalk.yellow('GITHUB_TOKEN=your-github-token')} to ${chalk.green('.env')} file.`)
    process.exit(0)
  }
}

/**
 * #### check if GitHub token is set and valid to use
 * @async
 * @memberof GITHUB
 * @param {LOCALDATA} data - data object
 * @returns undefined
 */
async function checkGithubToken (data) {
  const spinner = ora('Check GitHub token').start()
  try {
    const res = await request('GET /user', {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    })
    // check if 'x-oauth-scopes' exists
    if (!res.headers['x-oauth-scopes']) {
      spinner.fail()
      console.error(`${chalk.red('Error:')} GitHub token is invalid.`)
      console.error('Use GitHub Classic Personal access token with repo scope.')
      process.exit(1)
    }
    // check if 'repo' scope exists
    if (!res.headers['x-oauth-scopes'].split(',').includes('repo')) {
      spinner.fail()
      console.error(`${chalk.red('Error:')} GitHub token is invalid.`)
      console.error('Use GitHub Classic Personal access token with repo scope.')
      process.exit(1)
    }
    if (!data.github) {
      data.github = {}
    }
    data.github.login = res.data.login
    data.github.token = true
    spinner.succeed()
  } catch (error) {
    spinner.fail()
    console.error(`${chalk.red('Error:')} GitHub token is invalid.`)
    if (process.env.DEBUG_MODE === 'debug') {
      console.error(error)
    }
    process.exit(1)
  }
}

/**
 * #### get organization list for the user based on the token
 * @async
 * @memberof GITHUB
 * @param {LOCALDATA} data - data object
 * @returns undefined
 */
async function getGithubOrgs (data) {
  try {
    const res = await request('GET /user/orgs', {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    })
    if (!data.github) {
      data.github = {}
    }
    data.github.orgs = res.data.map(org => org.login)
  } catch (error) {
    console.error(`${chalk.red('Error:')} GitHub token is invalid.`)
    if (process.env.DEBUG_MODE === 'debug') {
      console.error(error)
    }
    process.exit(1)
  }
}

export { checkGithubTokenEnv, checkGithubToken, getGithubOrgs }
