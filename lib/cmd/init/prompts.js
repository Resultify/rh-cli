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
        description: 'Create a new local repo based on a GitHub hosted template'
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
 * @returns {Promise<boolean>} - is private
 */
async function confirmRepoPrivacy () {
  const answer = await confirm({
    message: 'Make the repository private?'
  })
  return answer
}

/**
 * #### confirm if to add secrets to the repo
 * @async
 * @private
 * @returns {Promise<boolean>} - is secrets
 */
async function confirmRepoSecrets () {
  const answer = await confirm({
    message: 'Add secrets to the repository?'
  })
  return answer
}

/**
 * #### collect secrets data
 * @async
 * @private
 * @returns {Promise<{hubspotPortalId: string, hubspotPersonalAccessKey: string}>} - repo secrets
 */
async function collectRepoSecrets () {
  const hubspotPortalId = await input({
    message: 'HUBSPOT_PORTAL_ID:',
    validate: (input) => {
      if (input.length < 1) {
        return 'Please enter a HubSpot portal ID'
      }
      if (!/^[0-9]*$/.test(input)) {
        return 'Please enter a valid HubSpot portal ID (numbers only)'
      }
      return true
    }
  })
  const hubspotPersonalAccessKey = await input({
    message: 'HUBSPOT_PERSONAL_ACCESS_KEY:',
    validate: (input) => {
      if (input.length < 1) {
        return 'Please enter a HubSpot personal access key'
      }
      if (!/^[a-zA-Z0-9-_]*$/.test(input)) {
        return 'Please enter a valid HubSpot personal access key (letters and numbers only)'
      }
      return true
    }
  })
  const repoSecrets = {
    hubspotPortalId,
    hubspotPersonalAccessKey
  }
  return repoSecrets
}

/**
 * #### collect data for the new child theme for GitHub repo
 * @param {LOCALDATA} data - env variables
 * @returns undefined
 */
async function githubRepoFromTemplatePrompts (data) {
  const childTheme = await selectRepoTemplate()
  const projectName = await getProjectName()
  const repoOwner = await selectRepoOwner(data)
  const isPrivate = await confirmRepoPrivacy()
  const isSecrets = await confirmRepoSecrets()
  let repoSecrets
  if (isSecrets) {
    repoSecrets = await collectRepoSecrets()
  }
  data.prompts = {
    githubRepoFromTmpl: {
      newRepoOwner: repoOwner,
      newRepoName: `${projectName}-${childTheme}-${new Date().getFullYear()}`,
      newRepoLabel: `${projectName} theme`,
      templateRepoOwner: 'Resultify',
      templateRepoName: childTheme,
      isPrivate,
      isSecrets,
      repoSecrets
    }
  }
}

/**
 * #### collect data for the new child theme for local repo
 * @param {LOCALDATA} data - env variables
 * @returns undefined
 */
async function localRepoFromTemplatePrompts (data) {
  const childTheme = await selectRepoTemplate()
  const projectName = await getProjectName()
  data.prompts = {
    localRepoFromTmpl: {
      newRepoName: `${projectName}-${childTheme}-${new Date().getFullYear()}`,
      newRepoLabel: `${projectName} theme`,
      templateRepoOwner: 'Resultify',
      templateRepoName: childTheme
    }
  }
}

export { githubRepoFromTemplatePrompts, localRepoFromTemplatePrompts, initType }
