/// <reference path="../types/types.js" />

/**
 * @summary Show help information
 * @param {LOCALDATA} data - cli data
 * @returns undefined
 */
function help (data) {
  console.log('\nUsage: rh [OPTIONS] COMMAND\n')
  console.log(`Options:
--version        Print version information and quit
-h, --help       Print general help information and quit
-d, --debug      Enable debug mode
-v, --verbose    Enable verbose mode
  `)
  console.log(`CLI Commands:
rh info          Info about the current project
rh init          Initialize a new project based on a predefined config
rh browsers      Show supported browsers and audience coverage
  `)
  console.log(`HubSpot CMS Lib Commands:
rh upload        Upload all
rh fetch         Fetch all
rh fetchModules  Fetch modules
rh build         Compile vendor files
rh watch         Watch-compile-upload
rh validate      HubSpot validation
rh fields        Convert fields.js to fields.json
rh fetchDb       Fetches HubDB table
rh uploadDb      Uploads and publish HubDB table
rh lighthouse    Lighthouse validation
rh lighthouse -- --verbose    Lighthouse validation with verbose output
  `)
}

export { help }
