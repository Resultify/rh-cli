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
 * #### github data object
 * @typedef {Object} GITHUB_DATA
 * @property {string} [login] - github user
 * @property {boolean} [token] - valid github token
 * @property {Array<string>} [orgs] - github orgs
 */

/**
 * #### github repository from template prompt data
 * @typedef {Object} GITHUB_REPO_FROM_TEMPLATE_PROMPT_DATA
 * @property {string} newRepoOwner - new repo owner
 * @property {string} newRepoName - new repo name
 * @property {string} newRepoLabel - new repo label
 * @property {string} templateRepoOwner - template repo owner
 * @property {string} templateRepoName - template repo name
 * @property {boolean} isPrivate - is private repo
 */

/**
 * #### github repository settings object
 * @typedef {Object} GITHUB_REPO_SETTINGS
  * @property {string} owner - The account owner of the repository. The name is not case sensitive.
  * @property {string} repo - The name of the repository without the .git extension. The name is not case sensitive.
  * @property {boolean} has_issues=true - has issues
  * @property {boolean} has_projects=true - has projects
  * @property {boolean} has_wiki=true - has wiki
  * @property {boolean} allow_rebase_merge=true - allow rebase merge
  * @property {boolean} allow_squash_merge=true - allow squash merge
  * @property {boolean} allow_merge_commit=true - allow merge commit
  * @property {boolean} delete_branch_on_merge=false - delete branch on merge
  * @property {boolean} allow_update_branch=false - allow update branch
  * @property {'PR_TITLE'|'COMMIT_OR_PR_TITLE'} squash_merge_commit_title=false - use squash pr title as default
 */

/**
 * #### github branch protection settings object
 * @typedef {Object} GITHUB_BRANCH_PROTECTION_SETTINGS
  * @property {string} owner - The account owner of the repository. The name is not case sensitive.
  * @property {string} repo - The name of the repository without the .git extension. The name is not case sensitive.
  * @property {string} branch - The name of the branch to protect.
  * @property {boolean?} enforce_admins - Enforce all configured restrictions for administrators. Set to true to enforce required status checks for repository administrators. Set to null to disable.
  * @property {Object} required_pull_request_reviews - Require at least one approving review on a pull request, before merging. Set to null to disable.
  * @property {boolean} required_pull_request_reviews.dismiss_stale_reviews - Set to true if you want to automatically dismiss approving reviews when someone pushes a new commit.
  * @property {number} required_pull_request_reviews.required_approving_review_count - Specify the number of reviewers required to approve pull requests. Use a number between 1 and 6 or 0 to not require reviewers.
  * @property {boolean} required_pull_request_reviews.require_last_push_approval=false - Whether the most recent push must be approved by someone other than the person who pushed it. Default: false.
  * @property {{strict:boolean, contexts:Array<string>}|null} required_status_checks - Require status checks to pass before merging. Set to null to disable.
  * @property {{users: string[]; teams: string[]; apps?: string[] | undefined;}|null} restrictions - Restrict who can push to the protected branch. User, app, and team restrictions are only available for organization-owned repositories. Set to null to disable.
  * @property {boolean} required_linear_history=false - Enforces a linear commit Git history, which prevents anyone from pushing merge commits to a branch. Set to true to enforce a linear commit history. Set to false to disable a linear commit Git history.
  * @property {boolean} required_conversation_resolution=false - Requires all conversations on code to be resolved before a pull request can be merged into a branch that matches this rule.
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
 * @property {GITHUB_DATA} [github] - github data
 * @property {Object} [prompts] - prompts data
 * @property {GITHUB_REPO_FROM_TEMPLATE_PROMPT_DATA} [prompts.repoFromTmpl] - init prompts data
 */

export default {}
