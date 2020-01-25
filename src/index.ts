import { posix } from "path"

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
      else config._ = options.cwd
      return parse(config, options)
    }
  })

export const tagFormat = `${
  require(posix.resolve(process.cwd(), "package.json")).name
}-v\${version}`
