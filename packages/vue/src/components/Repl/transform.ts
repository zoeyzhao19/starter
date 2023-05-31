import { compileScript, compileStyle, parse } from 'vue/compiler-sfc'
import type { CompilerOptions, SFCDescriptor } from 'vue/compiler-sfc'
import type { ReplState } from './state'

export function compileFile(state: ReplState) {
  const { code, filename } = state.activeFile

  if (!code.trim())
    return

  if (!filename.endsWith('.vue'))
    return

  const id = hash(filename)

  const { descriptor, errors } = parse(code, {
    filename,
    sourceMap: true,
  })
  if (errors.length) {
    state.errors = errors
    return
  }

  const scriptLang
    = (descriptor.script && descriptor.script.lang)
    || (descriptor.scriptSetup && descriptor.scriptSetup.lang)
  const isTS = scriptLang === 'ts'

  const script = doCompileScript(descriptor, `${id}`, isTS)
  const style = doCompileStyle(descriptor, `${id}`)

  state.errors = []
  state.activeFile.compiled.js = script
  state.activeFile.compiled.css = style
}

export function doCompileScript(descriptor: SFCDescriptor, id: string, isTS: boolean) {
  if (descriptor.script || descriptor.scriptSetup) {
    const expressionPlugins: CompilerOptions['expressionPlugins'] = isTS
      ? ['typescript']
      : undefined
    const result = compileScript(descriptor, {
      id,
      isProd: false,
      sourceMap: true,
      inlineTemplate: true,
      templateOptions: {
        compilerOptions: {
          expressionPlugins,
        },
      },
    })

    return result.content
  }
}

export function doCompileStyle(descriptor: SFCDescriptor, id: string) {
  let styleCode = ''
  for (const style of descriptor.styles) {
    const styleResult = compileStyle({
      source: style.content,
      filename: descriptor.filename,
      id,
      scoped: style.scoped,
    })
    styleCode += `${styleResult.code}\n`
  }

  if (styleCode)
    styleCode = styleCode.trim()
  else
    styleCode = '/* No <style> tags present */'

  return styleCode
}

function hash(str: string) {
  let hash = 0
  let i
  let chr
  if (str.length === 0)
    return hash
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}
