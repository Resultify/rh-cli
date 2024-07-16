/// <reference path="../types/types.js" />
import browserslist from 'browserslist'
import { isFileDirExists } from '../utils/fs.js'
import chalk from 'chalk'

/**
 * #### get browserslist info from ${cwdPath}/.browserlistrc
 * @async
 * @param {LOCALDATA} data - local data
 * @returns undefined
 */
async function browsers (data) {
  if (await isFileDirExists(`${data.cwd.path}/.browserslistrc`)) {
    const browsrs = browserslist(undefined, {
      path: `${data.cwd.path}/.browserslistrc`,
      config: '.browserslistrc'
    })
    const browserslistConfig = browserslist.readConfig(`${data.cwd.path}/.browserslistrc`)
    const configToString = browserslistConfig.defaults.join('__NEWLINE__').replace(/ /g, '+')
    const encodedString = encodeURI(configToString)
    const browserslistLink = encodedString.replace(/__NEWLINE__/g, '%0A') + '%0A'
    const global = browserslist.coverage(browserslist(browserslistConfig.defaults))
    const eu = browserslist.coverage(browserslist(browserslistConfig.defaults), 'alt-EU')
    const se = browserslist.coverage(browserslist(browserslistConfig.defaults), 'SE')
    const chromeFirst = browsrs.find(e => e.includes('chrome'))
    const chromeLast = browsrs.slice().reverse().find(e => e.includes('chrome'))
    const firefoxFirst = browsrs.find(e => e.includes('firefox'))
    const firefoxLast = browsrs.slice().reverse().find(e => e.includes('firefox'))
    const iosSafFirst = browsrs.find(e => e.includes('ios_saf'))
    const iosSafLast = browsrs.slice().reverse().find(e => e.includes('ios_saf'))
    const safariFirst = browsrs.find(e => e.includes('safari'))
    const safariLast = browsrs.slice().reverse().find(e => e.includes('safari'))
    const edgeFirst = browsrs.find(e => e.includes('edge'))
    const edgeLast = browsrs.slice().reverse().find(e => e.includes('edge'))
    const samsungFirst = browsrs.find(e => e.includes('samsung'))
    const samsungLast = browsrs.slice().reverse().find(e => e.includes('samsung'))
    const andChrFirst = browsrs.find(e => e.includes('and_chr'))
    const andChrLast = browsrs.slice().reverse().find(e => e.includes('and_chr'))
    console.log(chalk.green('\nSupported browsers:'))
    console.log(`Chrome ${chromeLast?.split(' ')[1]}-${chromeFirst?.split(' ')[1]}`)
    console.log(`Firefox ${firefoxLast?.split(' ')[1]}-${firefoxFirst?.split(' ')[1]}`)
    console.log(`iOS Safari ${iosSafLast?.split(' ')[1]}-${iosSafFirst?.split(' ')[1]}`)
    console.log(`Safari ${safariLast?.split(' ')[1]}-${safariFirst?.split(' ')[1]}`)
    console.log(`Edge ${edgeLast?.split(' ')[1]}-${edgeFirst?.split(' ')[1]}`)
    if (samsungFirst === samsungLast) {
      console.log(`Samsung ${samsungFirst?.split(' ')[1]}`)
    } else {
      console.log(`Samsung ${samsungLast?.split(' ')[1]}-${samsungFirst?.split(' ')[1]}`)
    }
    if (andChrFirst === andChrLast) {
      console.log(`Android Chrome ${andChrFirst?.split(' ')[1]}`)
    } else {
      console.log(`Android Chrome ${andChrLast?.split(' ')[1]}-${andChrFirst?.split(' ')[1]}`)
    }
    console.log(chalk.bold('\nAudience coverage:'))
    console.log(`Global: ${chalk.green(`${Math.ceil(global)}%`)}`)
    console.log(`Europe: ${chalk.green(`${Math.ceil(eu)}%`)}`)
    console.log(`Sweden: ${chalk.green(`${Math.ceil(se)}%`)}`)

    console.log(`\nClick to open the browser compatibility list:\n${chalk.cyan(`https://browsersl.ist/?results#q=${browserslistLink}`)}`)
  } else {
    console.log(`No .browserslistrc found in ${data.cwd.path}`)
  }
}

export { browsers }
