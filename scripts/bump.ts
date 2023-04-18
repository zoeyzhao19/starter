import {execa} from 'execa'
import versionBump from '@jsdevtools/version-bump-prompt'
import fsGlob from 'fast-glob'
import fs from 'fs'
import {load} from 'js-yaml'
import path from 'path'
import {fileURLToPath} from 'url'
import inquirer from 'inquirer';
import colors from 'colors'

let workspaceProjects: string[] = []

async function getAllWorkspaceProject() {
  try {
    const yamlPath = path.resolve(fileURLToPath(import.meta.url), '../../pnpm-workspace.yaml')
    const yamlContent = fs.readFileSync(yamlPath, {
      encoding: 'utf-8'
    })
    const doc = load(yamlContent)
    const packagesEntries = await fsGlob([...doc.packages], {
      onlyDirectories: true
    })
    packagesEntries.push('./')
    const resolvedPackagesEntries = packagesEntries.map(item => {
      return path.resolve(fileURLToPath(import.meta.url), `../../${item}`)
    })
    return resolvedPackagesEntries
  } catch (err) {
    console.error(err)
    return []
  }
}

async function interactive() {
  const SEPARATOR = 'SEPARATOR'
  const bumpTypes = ['major', 'minor', 'patch', 'premajor|pre-release major', 'preminor|pre-release minor', 'prepatch|pre-release patch', 'pre-release', SEPARATOR, 'leave|leave as-is', 'custom|custom...']
  inquirer.prompt({
    type: 'list',
    name: 'bumpType',
    message: 'How would you like to bump your workspace?',
    default: 'patch',
    pageSize: 10,
    choices: bumpTypes.map(item => {
      if(item === SEPARATOR) {
        return new inquirer.Separator()
      }
      return {
        name: item.split('|')[1] ?? item.split('|')[0],
        value: item.split('|')[0],
      }
    }),
    loop: false,
    prefix: '>',
  }).then((answers) => {
    console.log(colors.green(`Bumping all workspace projects to ${answers.bumpType}...`))
    workspaceProjects.map(item => {
      versionBump({
        release: answers.bumpType,
        cwd: item,
      })
    })
  })
}

workspaceProjects = await getAllWorkspaceProject()
interactive()