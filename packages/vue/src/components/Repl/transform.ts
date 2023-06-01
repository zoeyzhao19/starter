import { compileScript, compileStyle, compileTemplate, parse } from 'vue/compiler-sfc'
import type { BindingMetadata, CompilerOptions, SFCDescriptor } from 'vue/compiler-sfc'
import type { ReplState } from './state'

export const COMP_IDENTIFIER = '__sfc__'

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

  let [script, binding] = doCompileScript(descriptor, `${id}`, isTS)
  const style = doCompileStyle(descriptor, `${id}`)

  if (descriptor.template && !descriptor.scriptSetup) {
    const template = doCompileTemplate(descriptor, binding, `${id}`, isTS)
    script += template
  }

  state.errors = []
  state.activeFile.compiled.js = script
  state.activeFile.compiled.css = style
}

export function doCompileScript(descriptor: SFCDescriptor, id: string, isTS: boolean): [string, BindingMetadata | undefined] {
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

    let code = result.content

    if (result.bindings) {
      code += `\n/* Analyzed bindings: ${JSON.stringify(
        result.bindings,
        null,
        2,
      )} */`
    }

    return [code, result.bindings]
  }
  else {
    return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined]
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

export function doCompileTemplate(descriptor: SFCDescriptor, binding: BindingMetadata | undefined, id: string, isTS: boolean) {
  const result = compileTemplate({
    source: descriptor.template!.content,
    filename: descriptor.filename,
    id,
    isProd: false,
    scoped: descriptor.styles.some(s => s.scoped),
    compilerOptions: {
      bindingMetadata: binding,
      expressionPlugins: isTS ? ['typescript'] : undefined,
    },
  })

  const fnName = 'render'

  const code
    = `\n${result.code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`,
    )}` + `\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`

  return code
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
