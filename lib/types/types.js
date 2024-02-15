/**
 * #### commit message object
 * @typedef {Object} COMMIT_MESSAGE
 * @property {string} [commit] - commit
 * @property {string} prefix - commit message prefix
 * @property {string} message - commit message
 * @property {string} hash - commit message hash
 * @property {string} name - commit message author name
 * @property {string} [date] - commit message date
 */

/**
 * #### git data object
 * @typedef {Object} GIT_DATA
 * @property {boolean} isRepo - is git repo in current directory
 * @property {boolean} isRoot - is git root in current directory
 * @property {boolean} isCommits - is git commits
 * @property {boolean} isTagInCurrentCommit - is git tag in current commit
 * @property {boolean} isRemote - is git remote
 * @property {boolean} isBranchDetached - is git branch detached
 * @property {boolean} isBranchAhead - is git branch ahead
 * @property {boolean} isBranchBehind - is git branch behind
 * @property {string} hash - git hash
 * @property {string} branch - git branch
 * @property {string} lastTag - git last tag
 * @property {string} status - git status
 * @property {Array<COMMIT_MESSAGE>} log - git log
 * @property {string} branchUpstream - git branch upstream
 * @property {Array<string>} stagedFiles - is git staged files
 * @property {Array<string>} changedFiles - is git staged files
 * @property {Object} remote - git remote origin
 * @property {string} [remote.protocol] - git remote origin protocol
 * @property {string} [remote.href] - git remote origin href
 * @property {string} [remote.full_name] - git remote origin full_name
 * @property {string} [remote.host] - git remote origin host
 * @property {string} [remote.owner] - git remote origin owner
 * @property {string} [remote.name] - git remote origin name
 */

/**
 * #### cli package.json object
 * @typedef {Object} CLI_PACKAGE_JSON
 * @property {string} name - package name
 * @property {string} version - package version
 * @property {Object} engines - engines
 * @property {string} engines.node - node version
 * @property {string} engines.npm - npm version
 * @property {any} [dependencies] - dependencies object from package.json
 */

/**
 * #### cli package.json object
 * @typedef {Object} THEME_PACKAGE_JSON
 * @property {string} name - package name
 * @property {string} version - package version
 * @property {Object} engines - engines
 * @property {string} engines.node - node version
 * @property {string} engines.npm - npm version
 * @property {any} cmslib - cmslib object from package.json
 * @property {string} hubspotCmsLib - @resultify/hubspot-cms-lib version
 */

/**
 * #### theme.json object
 * @typedef {Object} THEME_JSON
 * @property {string} name - theme name
 * @property {string} label - theme label
 * @property {string} version - theme version
 * @property {string|boolean} parentTheme - parent theme
 * @property {string|boolean} hiddenModules - hidden modules list
 */

/**
 * #### data object
 * @typedef {Object} LOCALDATA
 * @property {CLI_PACKAGE_JSON} cli - cli info
 * @property {Object} system - system info
 * @property {string} system.node - system node version
 * @property {string} system.npm - system npm version
 * @property {string} system.git - system git version
 * @property {Object} cwd - current working directory
 * @property {string} cwd.path - current working directory path
 * @property {string} cwd.dir - current working directory dir
 * @property {string} cwd.base - current working directory base
 * @property {string} cwd.name - current working directory name
 * @property {THEME_PACKAGE_JSON|boolean} package - project package.json data
 * @property {THEME_JSON|boolean} theme - hubspot theme data from theme.json
 * @property {Array<string>|boolean} env - dot env variables
 * @property {GIT_DATA} git - git repo data
 */

export default {}
