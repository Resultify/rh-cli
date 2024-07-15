/// <reference path="../types/types.js" />
import { request } from '@octokit/request'
import chalk from 'chalk'
import ora from 'ora'

/**
 * #### update and commit file in the repository
 * @async
 * @memberof GITHUB
 * @param {string} owner - repository owner
 * @param {string} repo - repository name
 * @param {Array<string>} paths - file paths
 * @param {Object.<string, any>} changeValues - new values to update
 * @returns undefined
 */
async function updateAndCommit (owner, repo, paths, changeValues) {
  const spinner = ora(`Update [${paths.join(',')}] and commit`).start()
  try {
    // get latest master commit SHA
    const { data: { object: { sha: latestCommitSha } } } = await request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
      owner,
      repo,
      ref: 'heads/master',
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    })

    // get tree files and tree SHA
    const { data: { sha: latestTreeSha, tree } } = await request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
      owner,
      repo,
      tree_sha: latestCommitSha,
      recursive: 'true',
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    })

    const blobs = paths.map(path => {
      const file = tree.find(file => file.path === path)
      if (!file) {
        throw new Error(`File ${path} not found in the repository tree`)
      }
      const fileSha = file.sha
      if (!fileSha) {
        throw new Error(`File ${path} not found in the repository tree`)
      }
      return { path, fileSha }
    })

    // get and update the content of the blobs
    const newBlobs = await Promise.all(blobs.map(async ({ path, fileSha }) => {
      // get the content of the blob
      const { data: { content: oldContent } } = await request('GET /repos/{owner}/{repo}/git/blobs/{file_sha}', {
        owner,
        repo,
        file_sha: fileSha,
        headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      })

      // update the content of the file
      const fileData = JSON.parse(Buffer.from(oldContent, 'base64').toString('utf-8'))
      Object.keys(changeValues).forEach(key => {
        if (fileData[key]) {
          fileData[key] = changeValues[key]
        }
      })

      // update blob content
      const { data: { sha: newBlobSha } } = await request('POST /repos/{owner}/{repo}/git/blobs', {
        owner,
        repo,
        content: Buffer.from(JSON.stringify(fileData, null, 2) + '\n').toString('base64'),
        encoding: 'base64',
        headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      })

      return { path, sha: newBlobSha, mode: '100644', type: 'blob' }
    }))

    /**
     * @type {Array<Object>}
     */
    const newTree = newBlobs.map(({ path, sha }) => ({
      path,
      mode: '100644',
      type: 'blob',
      sha
    }))

    // new tree with the new blob
    const { data: { sha: newTreeSha } } = await request('POST /repos/{owner}/{repo}/git/trees', {
      owner,
      repo,
      base_tree: latestTreeSha,
      tree: newTree,
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    })

    // create a new commit with the new tree
    const { data: { sha: newCommitSha } } = await request('POST /repos/{owner}/{repo}/git/commits', {
      owner,
      repo,
      message: `[TASK] update ${paths.join(',')} with new project info`,
      tree: newTreeSha,
      parents: [latestCommitSha],
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    })

    // branch reference to latest commit
    await request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
      owner,
      repo,
      ref: 'heads/master',
      sha: newCommitSha,
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    })

    spinner.succeed()
  } catch (error) {
    spinner.fail()
    console.error(`${chalk.red('Error:')} ${error.message}`)
    if (process.env.RH_MODE === 'debug') {
      console.error(error)
    }
    process.exit(1)
  }
}

export { updateAndCommit }
