import {execa} from 'execa'
import fsGlob from 'fast-glob'
import fs from 'fs'
import {load} from 'js-yaml'
import path from 'path'
import {fileURLToPath, pathToFileURL} from 'url'
import inquirer from 'inquirer';
import colors from 'colors'
import semver from 'semver'

let workspaceProjects: {
  path: string;
  data: {
    name:string;
    version: string;
    [key: string]: any
  }
}[] = []

async function changelog() {
  await execa('conventional-changelog',  ['-p', 'angular', '-i', 'CHANGELOG.md', '-s', '-r', '0' ], {
    stdout: 'inherit',
  })
}

async function git(dryRun = false) {
    const commitMsg = `\"release: v${workspaceProjects[0].data.version}\"`
    await execa('git', dryRun ? ['add', '.', '--dry-run'] : ['add', '.'], {
      stdout: 'inherit',
    })
    await execa('git', dryRun ? ['commit', '-m', commitMsg, '--dry-run'] : ['commit', '-m', commitMsg], {
      stdout: 'inherit'
    })
    if(!dryRun) {
      await execa('git', ['tag', '--annotate', '--message', commitMsg, `v${workspaceProjects[0].data.version}`], {
        stdout: 'inherit'
      })
      await execa('git', ['push'])
      await execa('git', ['push', '--tags'])
    }
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
      const pkg = (await import(pathToFileURL(pkgPath).toString(), {
        assert: {
          type: 'json'
        }
      }))
      console.log(pkg.default)
      workspaceProjects.push({
        path: resolvedPath,
        data: pkg.default
      })
    }))
  } catch (err) {
    console.error(err)
    return []
  }
}

async function promptBump() {
  const SEPARATOR = 'SEPARATOR'
  const bumpTypes = ['major', 'minor', 'patch', 'premajor|pre-release major', 'preminor|pre-release minor', 'prepatch|pre-release patch', 'prerelease|pre-release', SEPARATOR, 'leave|leave as-is', 'custom|custom...']
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
    if(answers.bumpType === 'leave' || answers.bumpType === 'custom') {
      console.log(colors.cyan(`Current type ${colors.bold(answers.bumpType)} is not supported. Bump canceled`))
      return
    }
    console.log(colors.cyan(`Bumping...`))
    try {
      workspaceProjects.map(function(item){
        const newVersion = semver.inc(item.data.version, answers.bumpType)
        item.data.version = newVersion!
        fs.writeFile(path.resolve(item.path, './package.json'), JSON.stringify(item.data, null ,2), {
          encoding: 'utf-8'
        }, (err) => {
          if(err) {
            throw new Error(`update ${item.path} failed, \n${err}`)
          }
        })
      })
    } catch (err) {
      console.error(err)
      return
    }
    await changelog()
    await git()
    console.log(colors.green(`Bump succeed`))
  })
}

await getAllWorkspaceProject()
await promptBump()
