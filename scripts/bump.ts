import {execa} from 'execa'
import versionBump from '@jsdevtools/version-bump-prompt'
import fsGlob from 'fast-glob'
import fs from 'fs'
import {load} from 'js-yaml'
import path from 'path'
import {fileURLToPath, pathToFileURL} from 'url'
import inquirer from 'inquirer';
import colors from 'colors'

let workspaceProjects: {
  path: string;
  pkgName: string;
  newVersion?: string;
}[] = []

async function git() {
    const commitMsg = `\"release: v${workspaceProjects[0].newVersion}\"`
    await execa('git', ['add', '.'], {
      stdout: 'inherit',
    })
    await execa('git', ['commit', '-m', commitMsg], {
      stdout: 'inherit'
    })
    await execa('git', ['tag', '--annotate', '--message', commitMsg, `v${workspaceProjects[0].newVersion}`], {
      stdout: 'inherit'
    })
    await execa('git', ['push'])
    await execa('git', ['push', '--tags'])
}

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
    packagesEntries.unshift('./')
    await Promise.all(packagesEntries.map(async (item, index) => {
      const resolvedPath = path.resolve(fileURLToPath(import.meta.url), `../../${item}`)
      const pkgPath = path.resolve(resolvedPath, './package.json')
      const pkgName = (await import(pathToFileURL(pkgPath).toString(), {
        assert: {
          type: 'json'
        }
      })).name as string
      workspaceProjects.push({
        path: resolvedPath,
        pkgName
      })
    }))
  } catch (err) {
    console.error(err)
    return []
  }
}

async function promptBump() {
  const SEPARATOR = 'SEPARATOR'
  const bumpTypes = ['major', 'minor', 'patch', 'premajor|pre-release major', 'preminor|pre-release minor', 'prepatch|pre-release patch', 'pre-release', SEPARATOR, 'leave|leave as-is', 'custom|custom...']
  inquirer.prompt({
    type: 'list',
    name: 'bumpType',
    message: 'How would you like to bump it?',
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
  }).then(async(answers) => {
    console.log(colors.cyan(`Bumping...`))
    await Promise.all(workspaceProjects.map(async function(item){
      const bumpResult = await versionBump({
        release: answers.bumpType,
        cwd: item.path,
      })
      item.newVersion = bumpResult.newVersion
    }))
    await git()
    console.log(colors.green(`Bump succeed`))
  })
}

await getAllWorkspaceProject()
await promptBump()
