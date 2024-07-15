/// <reference path="../types/types.js" />
import gitUrlParse from 'git-url-parse'
import ora from 'ora'
import { $ } from 'execa'

/**
 * #### Check is Git Repo
 * @async
 * @memberof GIT
 * @returns {Promise<boolean>}
 */
async function isRepo () {
  try {
    const isRepo = await $`git rev-parse --is-inside-work-tree`
    if (isRepo.stdout === 'true') {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

/**
 * #### Check is Git root
 * @async
 * @memberof GIT
 * @returns {Promise<boolean>}
 */
async function isRoot () {
  try {
    const isGitdir = await $`git rev-parse --git-dir`
    if (/^\.(git)?$/.test(isGitdir.stdout.trim())) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

/**
 * #### Check is Git commits
 * @async
 * @memberof GIT
 * @returns {Promise<boolean>}
 */
async function isCommits () {
  try {
    const isCommits = await $`git rev-parse --all`
    if (isCommits.stdout.trim() !== '') {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

/**
 * #### Check is Git tag in current commit
 * @async
 * @memberof GIT
 * @returns {Promise<boolean>}
 */
async function isTagInCurrentCommit () {
  try {
    const isTagInCurrentCommit = await $`git tag --contains`
    if (isTagInCurrentCommit.stdout.trim() !== '') {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

/**
 * #### Check is Git Remote
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<boolean>}
 */
async function isRemote () {
  try {
    const isRemote = await $`git remote`
    if (isRemote.stdout.trim() !== '') {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

/**
 * #### Check is Git branch detached
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<boolean>}
 */
async function isBranchDetached () {
  try {
    const statusData = await status()
    if (statusData && /\(no branch\)/.test(statusData)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

/**
 * #### Check is Git branch ahead
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<boolean>}
 */
async function isBranchAhead () {
  try {
    const statusData = await status()
    if (statusData && /ahead (\d+)/.exec(statusData) !== null) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

/**
 * #### Check is Git behind
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<boolean>}
 */
async function isBranchBehind () {
  try {
    const statusData = await status()
    if (statusData && /behind (\d+)/.exec(statusData) !== null) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

/**
 * #### save git hash
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<string>}
 */
async function hash () {
  try {
    const hash = await $`git rev-parse --short HEAD`
    if (hash.stdout.trim() !== '') {
      return hash.stdout.trim()
    } else {
      return ''
    }
  } catch (error) {
    return ''
  }
}

/**
 * #### save git branch
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<string>}
 */
async function branch () {
  try {
    const branch = await $`git rev-parse --abbrev-ref HEAD`
    if (branch.stdout.trim() !== '') {
      return branch.stdout.trim()
    } else {
      return ''
    }
  } catch (error) {
    return ''
  }
}

/**
 * #### save last git tag
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<string>}
 */
async function lastTag () {
  try {
    const lastTag = await $`git describe --abbrev=0 --tags`
    if (lastTag.stdout.trim() !== '') {
      return lastTag.stdout.trim()
    } else {
      return ''
    }
  } catch (error) {
    return ''
  }
}

/**
 * #### save git status
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<string>}
 */
async function status () {
  try {
    const status = await $`git status --porcelain -b -u --null`
    // trim and remove \x00
    // eslint-disable-next-line no-control-regex
    const statusData = status.stdout.trim().replace(/\x00/g, '')
    if (statusData !== '') {
      return statusData
    } else {
      return ''
    }
  } catch (error) {
    return ''
  }
}

/**
 * #### Save git branch upstream
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<string>}
 */
async function branchUpstream () {
  try {
    /** @type {string} */
    const branchName = await branch()
    const branchUpstream = await $`git rev-parse --abbrev-ref ${branchName}@{u}`
    if (branchUpstream.stdout) {
      return branchUpstream.stdout.trim()
    } else {
      return ''
    }
  } catch (error) {
    return ''
  }
}

/**
 * #### save staged files
 * @async
 * @memberof GIT
 * @returns {Promise<Array<string>>} staged files array or false
 */
async function stagedFiles () {
  try {
    const stagedFiles = await $`git diff --name-only --cached`
    if (stagedFiles.stdout.trim() !== '') {
      return stagedFiles.stdout.trim().split('\n')
    } else {
      return []
    }
  } catch (error) {
    return []
  }
}

/**
 * #### save changed files
 * @async
 * @memberof GIT
 * @returns {Promise<Array<string>>} staged files array or false
 */
async function changedFiles () {
  try {
    const stagedFiles = await $`git diff --name-only`
    if (stagedFiles.stdout.trim() !== '') {
      return stagedFiles.stdout.trim().split('\n')
    } else {
      return []
    }
  } catch (error) {
    return []
  }
}

/**
 * #### save git origin remote info
 * @async
 * @private
 * @memberof GIT
 * @returns {Promise<Object>}
 */
async function remote () {
  try {
    const remoteUrl = await $`git remote get-url origin`
    const parseremote = gitUrlParse(remoteUrl.stdout.trim())
    if (parseremote) {
      return parseremote
    } else {
      return {}
    }
  } catch (error) {
    return {}
  }
}

/**
 * #### Genereta git info
 * @async
 * @memberof GIT
 * @returns {Promise<GIT_DATA>}
 */
async function gitData () {
  /** @type {GIT_DATA} */
  const git = {
    isRepo: false,
    isRoot: false,
    isCommits: false,
    isTagInCurrentCommit: false,
    isRemote: false,
    isBranchDetached: false,
    isBranchAhead: false,
    isBranchBehind: false,
    hash: '',
    branch: '',
    lastTag: '',
    status: '',
    log: [],
    branchUpstream: '',
    stagedFiles: [],
    changedFiles: [],
    remote: {}
  }

  git.isRepo = await isRepo()
  if (git.isRepo) {
    git.isRoot = await isRoot()
  }
  if (git.isRepo && git.isRoot) {
    git.isCommits = await isCommits()

    if (git.isCommits && !git.isTagInCurrentCommit) {
      git.isRemote = await isRemote()
      git.hash = await hash()
      git.branch = await branch()
      git.lastTag = await lastTag()
      git.status = await status()
      git.branchUpstream = await branchUpstream()
      git.stagedFiles = await stagedFiles()
      git.changedFiles = await changedFiles()

      if (git.isRemote) {
        git.remote = await remote()
        git.isBranchDetached = await isBranchDetached()
        git.isBranchAhead = await isBranchAhead()
        git.isBranchBehind = await isBranchBehind()
      }
    }
  }
  return git
}

/**
 * #### git remote update
 * @async
 * @private
 * @memberof GIT
 * @returns undefined
 */
async function gitRemoteUpdate () {
  const spinner = ora('Sync remote repo with local').start()
  try {
    await $`git remote update`
    spinner.succeed()
  } catch (error) {
    spinner.fail()
    console.error(error)
  }
}

/**
 * #### update git remote data
 * @async
 * @memberof GIT
 * @param {LOCALDATA} data - data object
 * @returns {Promise<LOCALDATA>} local data
 */
async function gitRemoteDataUpdate (data) {
  if (data.git.isRemote) {
    await gitRemoteUpdate()
    data.git.isBranchDetached = await isBranchDetached()
    data.git.isBranchAhead = await isBranchAhead()
    data.git.isBranchBehind = await isBranchBehind()
  }
  return data
}

/**
 * #### git add files
 * @async
 * @memberof GIT
 * @param {Array<string>} files - files to git add
 * @returns undefined
 */
async function gitAdd (files) {
  try {
    if (files.length > 0) {
      for await (const file of files) {
        await $`git add ${file}`
      }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * #### git add files
 * @async
 * @memberof GIT
 * @param {Object} [options] - execa options
 * @returns undefined
 */
async function gitAddAll (options) {
  try {
    if (options) {
      await $(options)`git add .`
    } else {
      await $`git add .`
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * #### git commit release
 * @async
 * @memberof GIT
 * @param {string} msg - commit message
 * @param {Object} [options] - execa options
 * @returns undefined
 */
async function gitCommit (msg, options) {
  const spinner = ora(msg).start()
  try {
    if (options) {
      await $(options)`git commit -m ${msg}`
    } else {
      await $`git commit -m ${msg}`
    }
    spinner.succeed()
  } catch (error) {
    spinner.fail()
    console.error(error)
  }
}

/**
 * #### git push to remote
 * @async
 * @memberof GIT

 * @returns undefined
 */
async function gitPush () {
  const spinner = ora('Push to remote').start()
  try {
    await $`git push`
    spinner.succeed()
  } catch (error) {
    spinner.fail()
    console.error(error)
  }
}

/**
 * #### git tag
 * @async
 * @memberof GIT
 * @param {string} tag - tag
 * @returns undefined
 */
async function gitTag (tag) {
  try {
    await $`git tag ${tag}`
  } catch (error) {
    console.error(error)
  }
}

/**
 * #### git push tag to remote
 * @async
 * @memberof GIT
 * @returns undefined
 */
async function gitPushTag () {
  const spinner = ora('Push tag to remote').start()
  try {
    await $`git push --tags`
    spinner.succeed()
  } catch (error) {
    spinner.fail()
    console.error(error)
  }
}

/**
 * #### git log
 * parse git log and use it to generate changelog
 * @async
 * @private
 * @memberof GIT
 * @param {LOCALDATA} data - data object
 * @returns {Promise<string[]>} log array
 */
async function gitLog (data) {
  let lastTag = 'HEAD'
  if (data.git.lastTag !== '') {
    lastTag = `${data.git.lastTag}..HEAD`
  }
  /** @type {Array<string>} */
  let log = []
  try {
    const { stdout } = await $`git log ${lastTag} --format=%s#@sep@#%an#@sep@#%h#@sep@#%aI`
    if (stdout !== '') {
      log = stdout.split('\n')
    }
    return log
  } catch (error) {
    return log
  }
}

/**
 * #### parse git log and return each commit message as object with changelog properties
 * @private
 * @memberof GIT
 * @param {string} commit - commit message
 * @returns {COMMIT_MESSAGE} portal name|names
 */
function parseCommit (commit) {
  const commitArray = commit.split('#@sep@#')
  const prefix = ''
  const message = commitArray[0].trim()
  const name = commitArray[1].trim()
  const hash = commitArray[2].trim()
  const date = commitArray[3].trim()
  return { commit, prefix, message, hash, name, date }
}

/**
 * #### parse and save git log
 * @async
 * @memberof GIT
 * @param {LOCALDATA} data - data object
 * @returns undefined
 */
async function saveGitlog (data) {
  /** @type {Array<COMMIT_MESSAGE>} */
  const gitLogData = []
  const logs = await gitLog(data)
  if (logs.length > 0) {
    logs.forEach((logItem) => {
      gitLogData.push(parseCommit(logItem))
    })
  }
  data.git.log = gitLogData
}

/**
 * #### git clone repo
 * @async
 * @memberof GIT
 * @param {string} folder - folder name
 * @returns undefined
 */
async function gitCloneDepth1 (folder) {
  const spinner = ora('Clone repo').start()
  try {
    await $`git clone --depth 1 git@github.com:Resultify/nimbly-lite-child.git ${folder}`
    spinner.succeed()
  } catch (error) {
    spinner.fail()
    console.error(error)
  }
}

/**
 * #### git init
 * @async
 * @memberof GIT
 * @param {Object} [options] - execa options
 * @returns undefined
 */
async function gitInit (options) {
  try {
    if (options) {
      await $(options)`git init --initial-branch=master`
    } else {
      await $`git init`
    }
  } catch (error) {
    console.error(error)
  }
}

export {
  isRepo,
  isRoot,
  isCommits,
  isTagInCurrentCommit,
  stagedFiles,
  changedFiles,
  gitData,
  gitRemoteDataUpdate,
  gitAdd,
  gitCommit,
  gitPush,
  gitTag,
  gitPushTag,
  saveGitlog,
  gitCloneDepth1,
  gitInit,
  gitAddAll
}
