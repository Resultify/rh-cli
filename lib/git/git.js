import { simpleGit } from 'simple-git'
import gitUrlParse from 'git-url-parse'

const git = simpleGit()

/**
 * @summary Check is Git Repo
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, boolean>>}
 */
async function isGitRepo () {
  try {
    const isGitRepo = await git.checkIsRepo()
    return { isGitRepo }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary Check is Git root
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, boolean>>}
 */
async function isGitRoot () {
  try {
    // @ts-ignore
    const isGitRoot = await git.checkIsRepo('root')
    return { isGitRoot }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary Check is Git commits
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, boolean>>}
 */
async function isGitCommits () {
  try {
    const isGitCommits = await git.revparse(['--all'])
    if (isGitCommits) {
      return { isGitCommits: true }
    } else {
      return { isGitCommits: false }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary Check is Git Staged Files
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, boolean>>}
 */
async function isGitStagedFiles () {
  try {
    const isGitStagedFiles = await git.status()
    if (isGitStagedFiles.staged.length === 0) {
      return { isGitStagedFiles: false }
    } else {
      return { isGitStagedFiles: true }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary Check is Git changed files
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, boolean>>}
 */
async function isGitChangedFiles () {
  try {
    const gitStatus = await git.status()
    if (gitStatus.renamed.length === 0 && gitStatus.modified.length === 0 && gitStatus.deleted.length === 0) {
      return { isGitChangedFiles: false }
    } else {
      return { isGitChangedFiles: true }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary Check is Git Remote
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, boolean>>}
 */
async function isGitRemote () {
  try {
    const gitRemote = await git.getRemotes()
    if (gitRemote.length === 0) {
      return { isGitRemote: false }
    } else {
      return { isGitRemote: true }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary save git origin remote info
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object>}
 */
async function gitRemoteOrigin () {
  try {
    const gitRemoteOriginUrl = await (await git.remote(['get-url', 'origin']))
    // @ts-ignore
    const parseGitRemoteOrigin = gitUrlParse(gitRemoteOriginUrl.trim())
    if (parseGitRemoteOrigin) {
      return {
        remoteOrigin: {
          protocol: parseGitRemoteOrigin.protocol,
          name: parseGitRemoteOrigin.name,
          owner: parseGitRemoteOrigin.owner,
          organization: parseGitRemoteOrigin.organization,
          full_name: parseGitRemoteOrigin.full_name,
          pathname: parseGitRemoteOrigin.pathname,
          source: parseGitRemoteOrigin.source,
          href: parseGitRemoteOrigin.href
        }
      }
    } else {
      return { remoteOrigin: '' }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary Check is Git branch detached
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, boolean>>} portal name|names
 */
async function isGitBranchDetached () {
  try {
    const gitStatus = await git.status()
    return { isGitBranchDetached: gitStatus.detached }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary Save git branch
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, string>>} portal name|names
 */
async function gitBranchUpstream () {
  try {
    const gitStatus = await git.status()
    if (gitStatus.tracking) {
      return { gitBranchUpstream: gitStatus.tracking }
    } else {
      return { gitBranchUpstream: '' }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary Check is Git tag in current commit
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, boolean>>} portal name|names
 */
async function isTagInCurrentCommit () {
  try {
    const isTagInCurrentCommit = await git.tag(['--contains'])
    if (isTagInCurrentCommit) {
      return { isTagInCurrentCommit: true }
    } else {
      return { isTagInCurrentCommit: false }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary Check is Git branch ahead
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, boolean>>} portal name|names
 */
async function isGitBrancAhead () {
  try {
    const gitStatus = await git.status()
    if (gitStatus.ahead) {
      return { isGitBrancAhead: true }
    } else {
      return { isGitBrancAhead: false }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary Check is Git behind
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, boolean>>} portal name|names
 */
async function isGitBranchBehind () {
  try {
    const gitStatus = await git.status()
    if (gitStatus.behind) {
      return { isGitBranchBehind: true }
    } else {
      return { isGitBranchBehind: false }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary Check is Git tags
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, boolean>>} portal name|names
 */
async function isGitTags () {
  try {
    const gitTags = await git.tags()
    if (gitTags.all.length > 0) {
      return { isGitTags: true }
    } else {
      return { isGitTags: false }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary save last git tag
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, string>>} portal name|names
 */
async function gitLastTag () {
  try {
    const gitTags = await git.tags()
    if (gitTags.latest) {
      return { gitLastTag: gitTags.latest }
    } else {
      return { gitLastTag: '' }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary save git branch
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, string>>} portal name|names
 */
async function gitBranch () {
  try {
    const gitBranch = await git.branch()
    if (gitBranch) {
      return { gitBranch: gitBranch.current }
    } else {
      return { gitBranch: '' }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary save git hash
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object<string, string>>} portal name|names
 */
async function gitHash () {
  try {
    const gitHash = await git.revparse(['--short', 'HEAD'])
    if (gitHash) {
      return { gitHash }
    } else {
      return { gitHash: '' }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @summary Genereta git info
 * @async
 * @memberof GIT
 * @param {Object} data - cli data
 * @returns {Promise<Object>}
 */
async function gitInfo (data) {
  try {
    data.git = { ...data.git, ...await isGitRepo() }
    if (data.git.isGitRepo) {
      data.git = { ...data.git, ...await isGitRoot() }
      data.git = { ...data.git, ...await isGitStagedFiles() }
      data.git = { ...data.git, ...await isGitChangedFiles() }

      data.git = { ...data.git, ...await isGitRemote() }
      if (data.git.isGitRemote) {
        data.git = { ...data.git, ...await gitRemoteOrigin() }
      }

      data.git = { ...data.git, ...await gitBranch() }
      if (data.git.gitBranch) {
        data.git = { ...data.git, ...await gitBranchUpstream() }
        data.git = { ...data.git, ...await isGitBranchDetached() }
        data.git = { ...data.git, ...await isGitBrancAhead() }
        data.git = { ...data.git, ...await isGitBranchBehind() }
      }

      data.git = { ...data.git, ...await isGitCommits() }
      if (data.git.isGitCommits) {
        data.git = { ...data.git, ...await gitHash() }
      }

      data.git = { ...data.git, ...await isGitTags() }
      if (data.git.isGitTags) {
        data.git = { ...data.git, ...await gitLastTag() }
        data.git = { ...data.git, ...await isTagInCurrentCommit() }
      }
    }
    return data
  } catch (error) {
    console.error(error)
  }
}

export { gitInfo, isGitRepo }
