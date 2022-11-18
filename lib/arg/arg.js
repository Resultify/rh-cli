import arg from 'arg'
import { customError } from '../utils/error.js'

/**
 * @summary parse cli args
 * @returns {Object} cli args
 */
function parseArgs () {
  try {
    const args = arg({
      // Types
      '--help': Boolean,
      '--version': Boolean,
      '--debug': Boolean,
      // Aliases
      '-h': '--help',
      '-v': '--version',
      '-d': '--debug'
    })
    return args
  } catch (error) {
    if (error.code === 'ARG_UNKNOWN_OPTION') {
      customError(error.message, error)
    } else {
      throw error
    }
  }
}

/**
 * @summary check if more than one non-flag argument
 * @returns undefined
 * @throws customError
 */
function checkIfMoreThanOneArg (args) {
  if (args._.length > 1) {
    customError('More than one non-flag argument')
  }
}

export { parseArgs, checkIfMoreThanOneArg }
