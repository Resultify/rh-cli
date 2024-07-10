import * as TYPES from '../types/types.js' // eslint-disable-line
import { checkIsOnline, checkSshConnection } from '../utils/check.js'
import { checkGithubTokenEnv, checkGithubToken, getGithubOrgs } from '../github/auth.js'
import { githubRepoFromTemplatePrompts, localRepoFromTemplatePrompts, initType } from './init/prompts.js'
import { createGithubRepoWithTemplate, updateGithubRepoSettings, updateGithubBranchProtection } from '../github/repo.js'
import { addRepositorySecrets } from '../github/secrets.js'
import { updateAndCommit } from '../github/commit.js'
import { confirmNextSteps } from '../utils/prompts.js'
import { gitCloneDepth1, gitInit, gitAddAll, gitCommit } from '../git/git.js'
import { parseJson, removePath, writeJson } from '../utils/fs.js'
import chalk from 'chalk'

/**
 * @ignore
 * @typedef {TYPES.LOCALDATA} LOCALDATA {@link LOCALDATA}
 */

/**
 * #### Create a new GitHub repo based on a GitHub hosted template
 * @param {LOCALDATA} data - local data
 * @private
 * @async
 * @returns undefined
 */
async function initGithubRepoBasedOnTemplate (data) {
  checkGithubTokenEnv()
  await checkIsOnline()
  await checkGithubToken(data)
  await getGithubOrgs(data)
  await githubRepoFromTemplatePrompts(data)
  await confirmNextSteps(
  `You are about to create a new repository with the following settings:
- New repo owner: ${chalk.blue(data.prompts?.githubRepoFromTmpl?.newRepoOwner)}
- New repo name: ${chalk.green(data.prompts?.githubRepoFromTmpl?.newRepoName)}
- Template owner: ${data.prompts?.githubRepoFromTmpl?.templateRepoOwner}
- Template name: ${data.prompts?.githubRepoFromTmpl?.templateRepoName}
- Private repo: ${chalk.bold.yellow(data.prompts?.githubRepoFromTmpl?.isPrivate)}
- Add secrets: ${chalk.bold.yellow(data.prompts?.githubRepoFromTmpl?.isSecrets)}`
  )
  await createGithubRepoWithTemplate(data)
  await updateGithubRepoSettings(data, {
    owner: data.prompts?.githubRepoFromTmpl?.newRepoOwner || '',
    repo: data.prompts?.githubRepoFromTmpl?.newRepoName || '',
    has_issues: true,
    has_projects: false,
    has_wiki: false,
    allow_rebase_merge: false,
    allow_squash_merge: true,
    allow_merge_commit: false,
    delete_branch_on_merge: true,
    allow_update_branch: true,
    squash_merge_commit_title: 'PR_TITLE'
  })
  await updateGithubBranchProtection(data, {
    owner: data.prompts?.githubRepoFromTmpl?.newRepoOwner || '',
    repo: data.prompts?.githubRepoFromTmpl?.newRepoName || '',
    branch: 'master',
    required_status_checks: {
      strict: true,
      contexts: [
        'test',
        'check-commit-message',
        'validate-theme'
      ]
    },
    enforce_admins: false,
    required_pull_request_reviews: {
      dismiss_stale_reviews: true,
      required_approving_review_count: 1,
      require_last_push_approval: true
    },
    restrictions: null,
    required_linear_history: true,
    required_conversation_resolution: true
  })
  if (data.prompts?.githubRepoFromTmpl?.isSecrets) {
    await addRepositorySecrets(data)
  }
  await updateAndCommit(
    data.prompts?.githubRepoFromTmpl?.newRepoOwner || '',
    data.prompts?.githubRepoFromTmpl?.newRepoName || '',
    ['package.json', 'theme/theme.json'],
    {
      name: data.prompts?.githubRepoFromTmpl?.newRepoName,
      label: `${data.prompts?.githubRepoFromTmpl?.newRepoLabel.charAt(0).toUpperCase()}${data.prompts?.githubRepoFromTmpl?.newRepoLabel.slice(1)}`
    }
  )
}

/**
 * #### Create a new local repo based on a GitHub hosted template
 * @param {LOCALDATA} data - local data
 * @private
 * @async
 * @returns undefined
 */
async function initLocalRepoBasedOnTemplate (data) {
  await checkIsOnline()
  await checkSshConnection('git@github.com')
  if (data.git?.isRepo) {
    console.error(`${chalk.bold.red('Error:')} This script requires to be run in a simple folder, not a git repository\n`)
    process.exit(1)
  }
  await localRepoFromTemplatePrompts(data)
  await confirmNextSteps(
  `You are about to create a new repository with the following settings:
- New repo name: ${chalk.green(data.prompts?.localRepoFromTmpl?.newRepoName)}
- Template owner: ${data.prompts?.localRepoFromTmpl?.templateRepoOwner}
- Template name: ${data.prompts?.localRepoFromTmpl?.templateRepoName}`
  )
  if (data.prompts?.localRepoFromTmpl?.newRepoName) {
    await gitCloneDepth1(data.prompts?.localRepoFromTmpl?.newRepoName)
    await removePath(`${data?.cwd.path}/${data.prompts?.localRepoFromTmpl?.newRepoName}/.git`)
    await gitInit({ cwd: `${data?.cwd.path}/${data.prompts?.localRepoFromTmpl?.newRepoName}` })
    await gitAddAll({ cwd: `${data?.cwd.path}/${data.prompts?.localRepoFromTmpl?.newRepoName}` })
    await gitCommit('Initial commit', { cwd: `${data?.cwd.path}/${data.prompts?.localRepoFromTmpl?.newRepoName}` })
    const packageJson = await parseJson(`${data?.cwd.path}/${data.prompts?.localRepoFromTmpl?.newRepoName}/package.json`)
    const themeJson = await parseJson(`${data?.cwd.path}/${data.prompts?.localRepoFromTmpl?.newRepoName}/theme/theme.json`)
    packageJson.name = data.prompts?.localRepoFromTmpl?.newRepoName
    themeJson.name = data.prompts?.localRepoFromTmpl?.newRepoName
    themeJson.label = `${data.prompts?.localRepoFromTmpl?.newRepoLabel.charAt(0).toUpperCase()}${data.prompts?.localRepoFromTmpl?.newRepoLabel.slice(1)}`
    await writeJson(`${data?.cwd.path}/${data.prompts?.localRepoFromTmpl?.newRepoName}/package.json`, packageJson)
    await writeJson(`${data?.cwd.path}/${data.prompts?.localRepoFromTmpl?.newRepoName}/theme/theme.json`, themeJson)
    await gitAddAll({ cwd: `${data?.cwd.path}/${data.prompts?.localRepoFromTmpl?.newRepoName}` })
    await gitCommit('[TASK] update package.json and theme.json with new project info', { cwd: `${data?.cwd.path}/${data.prompts?.localRepoFromTmpl?.newRepoName}` })
  }
}

/**
 * #### Show info about the current project
 * @param {LOCALDATA} data - local data
 * @async
 * @returns undefined
 */
async function init (data) {
  const type = await initType()
  if (type === 'github-repo-based-on-template') {
    await initGithubRepoBasedOnTemplate(data)
  } else if (type === 'local-repo-based-on-template') {
    await initLocalRepoBasedOnTemplate(data)
  }
}

export { init }
