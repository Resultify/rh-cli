import * as TYPES from '../../types/types.js' // eslint-disable-line
import select from '@inquirer/select'
import input from '@inquirer/input'
import confirm from '@inquirer/confirm'

/**
* @ignore
* @typedef {TYPES.LOCALDATA} LOCALDATA {@link LOCALDATA}
*/

/**
 * #### select what to initialize
 * @async
 * @returns {Promise<string>} - init type
 */
async function initType () {
  const answer = await select({
    message: 'Initailize:',
    choices: [
      {
        name: 'GitHub repo based on template',
        value: 'github-repo-based-on-template',
        description: 'Create a new GitHub repo based on a GitHub hosted template'
      },
      {
        name: 'Local repo based on template',
        value: 'local-repo-based-on-template',
        description: 'Create a new local repo based on a GitHub hosted template',
        disabled: true
      }
    ]
  })
  return answer
}

/**
 * #### select new repo owner
 * @async
 * @private
 * @param {LOCALDATA} data - data object
 * @returns {Promise<string>} - new repo owner
 */
async function selectRepoOwner (data) {
  if (data.github && data.github.orgs && data.github.login) {
    const owners = data.github.orgs.map((/** @type {string} */ org) => {
      return {
        name: org,
        value: org,
        description: 'Repository owner to create the new repository'
      }
    })
    owners.push({
      name: data.github.login,
      value: data.github.login,
      description: 'Repository owner to create the new repository'
    })
    const answer = await select({
      message: 'Select repo owner:',
      choices: owners
    })
    return answer
  } else {
    throw new Error('No GitHub user/orgs found')
  }
}

/**
 * #### get project name
 * @async
 * @private
 * @returns {Promise<string>} - project name
 */
async function getProjectName () {
  const getProjectName = await input({
    message: 'New project name:',
    validate: (input) => {
      if (input.length < 1) {
        return 'Please enter a project name'
      }
      if (!/^[a-zA-Z0-9-]*$/.test(input)) {
        return 'Please enter a valid project name in one word or with hyphens'
      }
      return true
    }
  })
  const projectName = getProjectName.toLowerCase().trim()
  return projectName
}

/**
 * #### Select child theme
 * @async
 * @private
 * @returns {Promise<string>} - child theme
 */
async function selectRepoTemplate () {
  const answer = await select({
    message: 'Choose template:',
    choices: [
      {
        name: 'Nimbly lite child',
        value: 'nimbly-lite-child',
        description: 'Nimbly Light child theme template'
      },
      {
        name: 'Nimbly pro child',
        value: 'nimbly-pro-child',
        description: 'Nimbly Pro child theme template',
        disabled: true
      }
    ]
  })
  return answer
}

/**
 * #### confirm if repo should be private
 * @async
 * @private
 * @returns {Promise<boolean>} - child theme
 */
async function confirmRepoPrivacy () {
  const answer = await confirm({
    message: 'Make the repository private?'
  })
  return answer
}

/**
 * #### collect data for the new child theme
 * @param {LOCALDATA} data - env variables
 * @returns undefined
 */
async function githubRepoFromTemplatePrompts (data) {
  const childTheme = await selectRepoTemplate()
  const projectName = await getProjectName()
  const repoOwner = await selectRepoOwner(data)
  const isPrivate = await confirmRepoPrivacy()
  data.prompts = {
    repoFromTmpl: {
      newRepoOwner: repoOwner,
      newRepoName: `${projectName}-${childTheme}-${new Date().getFullYear()}`,
      newRepoLabel: `${projectName} theme`,
      templateRepoOwner: 'Resultify',
      templateRepoName: childTheme,
      isPrivate
    }
  }
}

export { githubRepoFromTemplatePrompts, initType }
