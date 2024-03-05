import confirm from '@inquirer/confirm'

/**
 * #### select what to initialize
 * @async
 * @param {string} msg - message
 * @returns undefined
 */
async function confirmNextSteps (msg) {
  console.log(msg)
  const answer = await confirm({ message: 'Confirm and continue?' })
  if (!answer) {
    process.exit(0)
  }
}

export { confirmNextSteps }
