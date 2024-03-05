import * as TYPES from '../types/types.js' // eslint-disable-line
import { checkIsOnline } from '../utils/check.js'
import { checkGithubTokenEnv, checkGithubToken, getGithubOrgs } from '../github/auth.js'
import { githubRepoFromTemplatePrompts, initType } from './init/prompts.js'
import { createGithubRepoWithTemplate, updateGithubRepoSettings, updateGithubBranchProtection } from '../github/repo.js'
import { updateAndCommit } from '../github/commit.js'
import { confirmNextSteps } from '../utils/prompts.js'
import chalk from 'chalk'

/**
 * @ignore
 * @typedef {TYPES.LOCALDATA} LOCALDATA {@link LOCALDATA}
 */

/**
 * #### Show info about the current project
 * @param {LOCALDATA} data - local data
 * @async
 * @returns undefined
 */
async function init (data) {
  const type = await initType()
  if (type === 'github-repo-based-on-template') {
    checkGithubTokenEnv()
    await checkIsOnline()
    await checkGithubToken(data)
    await getGithubOrgs(data)
    await githubRepoFromTemplatePrompts(data)
    await confirmNextSteps(
    `You are about to create a new repository with the following settings:
  - Owner: ${chalk.blue(data.prompts?.repoFromTmpl?.newRepoOwner)}
  - Name: ${chalk.green(data.prompts?.repoFromTmpl?.newRepoName)}
  - Template owner: ${data.prompts?.repoFromTmpl?.templateRepoOwner}
  - Template name: ${data.prompts?.repoFromTmpl?.templateRepoName}`
    )
    await createGithubRepoWithTemplate(data)
    await updateGithubRepoSettings(data, {
      owner: data.prompts?.repoFromTmpl?.newRepoOwner || '',
      repo: data.prompts?.repoFromTmpl?.newRepoName || '',
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
      owner: data.prompts?.repoFromTmpl?.newRepoOwner || '',
      repo: data.prompts?.repoFromTmpl?.newRepoName || '',
      branch: 'master',
      required_status_checks: {
        strict: true,
        contexts: [
          'Node (18)',
          'Node (20)',
          'Check Commit Message',
          'Validate theme'
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
    await updateAndCommit(
      data.prompts?.repoFromTmpl?.newRepoOwner || '',
      data.prompts?.repoFromTmpl?.newRepoName || '',
      ['package.json', 'theme/theme.json'],
      {
        name: data.prompts?.repoFromTmpl?.newRepoName,
        label: data.prompts?.repoFromTmpl?.newRepoLabel
      }
    )
  }
}

export { init }
