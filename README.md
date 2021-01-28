# @kludge-cs/semantic-release-monorepo

[![Build Status](https://github.com/kludge-cs/semantic-release-monorepo/workflows/CI%3A%20Build/badge.svg?branch=master)]
[![npm](https://img.shields.io/npm/v/@kludge-cs/semantic-release-monorepo.svg)](https://www.npmjs.com/package/@kludge-cs/semantic-release-monorepo)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Credit to [@pmowrer] for the [original plugin]. This is a TypeScript rewrite,
with additional features, intended originally for the [Sapphire Project] but
since made available to the public in accordance with KCS policy.

This is a package to apply [`semantic-release`]'s automatic publishing to
monorepo based packages.

[`semantic-release`]: https://github.com/semantic-release/semantic-release
[@pmowrer]: https://github.com/pmowrer
[original plugin]: https://github.com/pmowrer/semantic-release-monorepo
[Sapphire Project]: https://github.com/sapphire-project

## Why

The default configuration of `semantic-release` assumes a one-to-one
relationship between a GitHub repository and a package.

This library allows using `semantic-release` with a single GitHub repository
containing many packages, intended to replace the drawbacks of Lerna with a
fully automated version.

## How

Instead of attributing all commits to a single package, commits are assigned to
packages based on the files that a commit touched.

If a commit touched a file in a package's directory, it will be used exclusively
for that package's next release. A single commit can belong to multiple packages
and may trigger the release of multiple packages, depending on files changed.

In order to avoid version collisions, generated git tags are namespaced using
the given package's name: `<package-name>-<version>`.

## Install

Both `semantic-release` and `semantic-release-monorepo` must be accessible in
each monorepo package (this will be changed in a future release) unless you are
[using Lerna](#with-lerna) to execute across all packages.

```bash
npm install -D semantic-release semantic-release-monorepo
```

## Usage

Run `semantic-release` in the **root of a monorepo package** and apply
`semantic-release-monorepo` via the [`extends`] option.

On the command line:

```bash
$ npm run semantic-release -e semantic-release-monorepo
```

Or in the [release config]:

```json
{
  "extends": "semantic-release-monorepo"
}
```

NOTE: This library **CAN'T** be applied via the `plugins` option.
The following **WILL NOT** work.

```json
{
  "plugins": [
    "semantic-release-monorepo"
  ]
}
```

[`extends`]: https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#extends
[release config]: https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration-file

### With Lerna

The monorepo management tool [`lerna`](https://github.com/lerna/lerna) can be
used to run `semantic-release-monorepo` across all packages in a monorepo with a
single command:

```bash
lerna exec --concurrency 1 -- npx --no-install semantic-release -e semantic-release-monorepo
```

Thanks to [how npx's package resolution works][npx], if the repository root is
in `$PATH` (typically true in CI), `semantic-release` and
`semantic-release-monorepo` can be installed once in the repo root instead of in
each individual package, saving both time and disk space.

[npx]: https://github.com/npm/npx#description

## Advanced

This library modifies the `context` object passed to `semantic-release` plugins
in the following way to make them compatible with a monorepo.

| Step               | Description                                                                  |
|--------------------|------------------------------------------------------------------------------|
| `analyzeCommits`   | Filters `context.commits` to only include monorepo package's commits.        |
| `generateNotes`    | Modifies `context.nextRelease.version` to use the [monorepo git tag format]. |

### `tagFormat`

This plugin also configures the [`tagFormat` option][tag-format] to use the
[monorepo git tag format].

If you are using Lerna, you can customize the format with the following CLI
flag, where `'${LERNA_PACKAGE_NAME}-v\\${version}'` is the string you want to
customize. By default it will be `<PACKAGE>-v<VERSION>` (e.g. `foobar-v1.2.3`).

```bash
--tag-format='${LERNA_PACKAGE_NAME}-v\\${version}'
```

[tag-format]: https://github.com/semantic-release/semantic-release/blob/caribou/docs/usage/configuration.md#tagformat
[monorepo git tag format]: #how
