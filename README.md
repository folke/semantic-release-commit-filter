# :rocket: :female_detective: Semantic-Release Commit Filter

This package is a [shareable configuration](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/shareable-configurations.md) for [semantic-release](https://github.com/semantic-release/semantic-release) that:

- configures `tagFormat` to use the package name from the current directory `${package.name}-v${version}`
- uses `commits` only applicable to the current directory

## :question: Why

Suppose you have a monorepo with two packages:

```
$ tree -P "package.json|release.config.js" -I node_modules mono-semver
mono-semver
├── package.json
├── packages
│   ├── pkg1
│   │   ├── package.json
│   │   └── release.config.js
│   └── pkg2
│       ├── package.json
│       └── release.config.js
└── release.config.js

3 directories, 6 files
```

Now we can run `semantic-release` in any of the package directories and/or in the top-level directory.

`CHANGELOG.md` files and `package.json` versions will be maintained in every directory.

## :package: Installation

Make sure that if you have `semantic-release` installed globally, also install `semantic-release-commit-filter` globally. Same with local install.

```console
$ npm install --dev semantic-release-commit-filter

$ yarn install --dev semantic-release-commit-filter
```

> **!!** make sure you make `semantic-release` available in every `package.json` file. Additionally, every package directory needs its own semantic release configuration file.

## :gear: Configuration

You can either specify this packages in your [release config file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#extends):

```json
{
  "extends": ["semantic-release-commit-filter"]
}
```

or specify it as a paramater to the `semantic-release` cli

```shell
$ npx semantic-release -e semantic-release-commit-filter
```
