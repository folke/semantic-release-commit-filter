import { posix } from "path"
import { existsSync } from "fs"

function findLocalDependencyPaths(cwd: string): string[] {
  const filePathPrefix = "file:"
  const absPath = posix.resolve(process.cwd(), cwd.replace(filePathPrefix, ""))
  const absPackageJsonPath = posix.resolve(absPath, "package.json")

  if (!existsSync(absPackageJsonPath)) return []
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { dependencies = {} } = require(absPackageJsonPath)

  return Object.entries(dependencies as { [key: string]: string })
    .filter(([, path]) => path.startsWith(filePathPrefix))
    .map(([, path]) => findLocalDependencyPaths(path))
    .reduce((acc, paths) => [...acc, ...paths], [absPath])
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

      const foundPaths = config._.map(path =>
        findLocalDependencyPaths(path)
      ).reduce((acc, paths) => [...acc, ...paths], [])
      const uniquePaths = [...new Set(foundPaths)]
      config._ = [...config._, ...uniquePaths]

      return parse(config, options)
    }
  })

export const tagFormat = `${
  require(posix.resolve(process.cwd(), "package.json")).name
}-v\${version}`
