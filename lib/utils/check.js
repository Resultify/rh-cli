/// <reference path="../types/types.js" />
import semver from 'semver'
import { $ } from 'execa'
import isOnline from 'is-online'
import chalk from 'chalk'
import * as git from '../git/git.js'
import ora from 'ora'

/**
 * #### Check node version
 * Will throw an error if node version is wrong
 * @async
 * @memberof CHECK
 * @param {CLI_PACKAGE_JSON} packageJson - CLI package.json
 * @returns undefined
 * @throws console.error & process.exit(1) if node version is wrong
 */
async function checkNode (packageJson) {
  const engines = packageJson.engines
  if (!semver.satisfies(process.version, engines.node)) {
    console.error(`${chalk.bold.red('Error:')} Required node version ${chalk.yellow(engines.node)} not satisfied with current version ${process.version}\n`)
    process.exit(1)
  }
}

/**
 * #### Check if shell bin exists
 * @async
 * @memberof CHECK
 * @param {string} bin - bin name
 * @returns undefined
 * @throws process.exit(1) if bin does not exist
 */
async function checkIfBinExists (bin) {
  try {
    await $`which ${bin}`
  } catch (error) {
    console.error(`${chalk.bold.red('Error:')} This script requires ${chalk.yellow(bin)} to be instaled\n`)
    process.exit(1)
  }
}

/**
 * #### Check if git repo and git root
 * @async
 * @memberof CHECK
 * @returns undefined
 * @throws process.exit(1) if not git repo or not git root
 */
async function checkIfGitRepoAndRoot () {
  const isRepo = await git.isRepo()
  const isRoot = await git.isRoot()
  if (!isRepo) {
    console.error(`${chalk.bold.red('Error:')} This script requires to be run in a git repository\n`)
    process.exit(1)
  }
  if (!isRoot) {
    console.error(`${chalk.bold.red('Error:')} This script requires to be run in the root of a git repository\n`)
    process.exit(1)
  }
}

/**
 * #### Check if commit message exists
 * @async
 * @memberof CHECK
 * @returns undefined
 * @throws process.exit(1) if no commit message exists
 */
async function checkIfCommitMessageExists () {
  const isCommits = await git.isCommits()
  if (!isCommits) {
    console.error(`${chalk.bold.red('Error:')} This script requires to be run in a git repository with at least one commit\n`)
    process.exit(1)
  }
}

/**
 * #### Check if current commit has a tag
 * @async
 * @memberof CHECK
 * @param {LOCALDATA} data - data
 * @returns undefined
 * @throws process.exit(1)
 */
async function checkIfCommitHasTag (data) {
  data.git.isTagInCurrentCommit = await git.isTagInCurrentCommit()
  if (data.git.isTagInCurrentCommit) {
    console.error(`${chalk.bold.red('Error:')} Your current commit is already marked as a tagged release, you need at least one commit between releases\n`)
    process.exit(1)
  }
}

/**
 * #### check local repo status
 * @async
 * @memberof CHECK
 * @param {LOCALDATA} data - data
 * @returns undefined
 * @throws process.exit(1) or warning if repo status is not ok
 */
async function checkLocalRepo (data) {
  if (data.git.branch !== 'master' && data.git.branch !== 'main') {
    console.warn(`${chalk.red('Warning:')} you are not on ${chalk.blue('master')} or ${chalk.blue('main')} branch\n`)
  }
  if (data.git.stagedFiles.length > 0) {
    console.warn(`${chalk.red('Warning:')} You alredy have files staged for commit. It is recommended to commit them separately before proceeding with the release.\n`)
  }
}

/**
 * #### check remote repo status
 * @async
 * @memberof CHECK
 * @param {LOCALDATA} data - data
 * @returns undefined
 * @throws process.exit(1) or warning if remote repo status is not ok
 */
function checkRemoteRepo (data) {
  if (data.git.isRemote) {
    if (data.git.isBranchBehind) {
      console.error(`${chalk.bold.red('Error:')} Your branch is behind ${chalk.cyan(data.git.branchUpstream)}\n`)
      process.exit(1)
    }
    if (data.git.isBranchAhead) {
      console.error(`${chalk.bold.red('Error:')} Your branch is ahead ${chalk.cyan(data.git.branchUpstream)}\n`)
      process.exit(1)
    }
    if (data.git.isBranchDetached) {
      console.error(`${chalk.bold.red('Error:')} Your branch is detached\n`)
      process.exit(1)
    }
    // check if remote protocol not ssh and disable remote release type
    if (data.git.remote.protocol && data.git.remote.protocol !== 'ssh') {
      data.git.isRemote = false
      console.error(`${chalk.bold.red('Error:')} You are using non-SSH remote ${chalk.cyan(data.git.remote.href)}`)
      console.error('Remote release type only works with SSH remote URLs.\n')
      process.exit(1)
    }
  }
}

/**
 * #### check ssh connection
 * @async
 * @memberof CHECK
 * @param {string} serverUrl - server url
 * @returns undefined
 * @throws process.exit(1) if  ssh connection fails
 */
async function checkSshConnection (serverUrl) {
  const spinner = ora('Check ssh connection').start()
  try {
    await $`ssh -T -o ConnectTimeout=5 -o BatchMode=yes ${serverUrl}`
    spinner.succeed()
  } catch (error) {
    if (!error.stderr.includes('successfully authenticated')) {
      spinner.fail()
      console.error(`${chalk.bold.red('Error:')} Host key verification failed.`)
      console.error(`SSH connection to ${chalk.cyan(serverUrl)} failed.`)
      console.error('Make sure you\'ve set up your SSH key and added it to your account.\n')
      process.exit(1)
    }
    spinner.succeed()
  }
}

/**
 * #### Check ssh permissions to current repo
 * @async
 * @memberof CHECK
 * @returns undefined
 * @throws process.exit(1) if ssh permissions to current repo fails
 */
async function checkSshPermissions () {
  const spinner = ora('Check ssh permissions').start()
  try {
    await $`git push --dry-run`
    spinner.succeed()
  } catch (error) {
    spinner.fail()
    if (error.stderr.includes('denied')) {
      console.error(`${chalk.bold.red('Error:')} Permission to current repo denied to your user.`)
      console.error('To fix this, the owner of the repository needs to add your account as a collaborator on the repository or to a team that has write access to the repository.\n')
      process.exit(1)
    }
    console.error(error.stderr)
    process.exit(1)
  }
}

/**
 * #### check is online
 * @async
 * @memberof CHECK
 * @returns undefined
 * @throws process.exit(1) if not online
 */
async function checkIsOnline () {
  console.log('')
  const spinner = ora('Check internet connection').start()
  const isOnlineResult = await isOnline()
  if (!isOnlineResult) {
    spinner.fail()
    console.error(`${chalk.bold.red('Error:')} No Internet connection\n`)
    process.exit(1)
  }
  spinner.succeed()
}

/**
 * #### check is HubSpot CMS theme
 * @memberof CHECK
 * @param {LOCALDATA} data - data
 * @returns undefined
 * @throws process.exit(1) if not a HubSpot CMS theme
 */
function checkIsHubSpotCmsTheme (data) {
  if (!data.theme && !data.package) {
    console.warn(`${chalk.bold.red('[Error]')} This is not a HubSpot CMS theme folder`)
    console.warn('Open HubSpot CMS theme folder and run the command again\n')
    process.exit(1)
  }
}

/**
 * #### check if CLI is compatible with HubSpot CMS theme
 * @memberof CHECK
 * @param {LOCALDATA} data - data
 * @param {CLI_PACKAGE_JSON} cliPackageJson - cli package.json
 * @returns undefined
 * @throws process.exit(1) if not a HubSpot CMS theme
 */
function checkCliToThemeCompatibility (data, cliPackageJson) {
  const msg = () => {
    console.error(`${chalk.bold.red('[Error]')} This HubSpot theme is not compatible with this CLI`)
    process.exit(1)
  }
  if (typeof data.package === 'object' && data.package.cmslib && data.package.hubspotCmsLib && cliPackageJson.dependencies['@resultify/hubspot-cms-lib']) {
    const themeCmsLibValidRange = semver.coerce(data.package.hubspotCmsLib)
    const cliCmsLib = cliPackageJson.dependencies['@resultify/hubspot-cms-lib']
    if (themeCmsLibValidRange != null && semver.diff(themeCmsLibValidRange.version, cliCmsLib) === 'major') {
      msg()
    }
  } else {
    msg()
  }
}

export {
  checkNode,
  checkIfBinExists,
  checkIfGitRepoAndRoot,
  checkIfCommitMessageExists,
  checkIfCommitHasTag,
  checkLocalRepo,
  checkRemoteRepo,
  checkSshConnection,
  checkSshPermissions,
  checkIsOnline,
  checkIsHubSpotCmsTheme,
  checkCliToThemeCompatibility
}
