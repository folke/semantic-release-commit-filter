import { posix } from "path"
import { existsSync } from "fs"

const PROCESS_CWD = process.cwd()
const filePathPrefix = "file:"

function resolveAbsPath(path: string) {
  return posix.resolve(PROCESS_CWD, path.replace(filePathPrefix, ""))
}

function findLocalDependencyPaths(
  cwd: string,
  resolvedPaths: Set<string>
): string[] {
  const absPath = resolveAbsPath(cwd)
  const absPackageJsonPath = posix.resolve(absPath, "package.json")

  if (!existsSync(absPackageJsonPath)) return []
  resolvedPaths.add(absPath)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { dependencies = {} } = require(absPackageJsonPath)

  return Object.entries(dependencies as { [key: string]: string })
    .map(([, path]) => [path, resolveAbsPath(path)])
    .filter(
      ([path, resolvedAbsPath]) =>
        path.startsWith(filePathPrefix) && !resolvedPaths.has(resolvedAbsPath)
    )
    .flatMap(([, resolvedAbsPath]) => {
      resolvedPaths.add(resolvedAbsPath)
      return findLocalDependencyPaths(resolvedAbsPath, resolvedPaths)
    })
}

Object.keys(require.cache)
  .filter(m =>
    posix.normalize(m).endsWith("/node_modules/git-log-parser/src/index.js")
  )
  .forEach(moduleName => {
    const parse = require.cache[moduleName].exports.parse
    require.cache[moduleName].exports.parse = (
      config: { _?: string | string[] },
      options: { cwd: string }
    ) => {
      if (Array.isArray(config._)) config._.push(options.cwd)
      else if (config._) config._ = [config._, options.cwd]
      else config._ = [options.cwd]

      const resolvedPaths = new Set<string>()
      config._.flatMap(path =>
        findLocalDependencyPaths(resolveAbsPath(path), resolvedPaths)
      )
      config._ = [...config._, ...resolvedPaths]

      return parse(config, options)
    }
  })

export const tagFormat = `${
  require(posix.resolve(PROCESS_CWD, "package.json")).name
}-v\${version}`
