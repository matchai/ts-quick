<p align="center">
  <img alt="lightning bolt" src="./media/logo.svg" width=100px>

<h3 align="center">ts-quick️</h3>
<p align="center">Zero configuration JavaScript static analysis</p>
<p align="center"><a href="https://travis-ci.org/matchai/ts-quick"><img src="https://badgen.net/travis/matchai/ts-quick" alt="Build Status"></a></p>
</p>
---

Easily enforce JSDoc types throughout your JavaScript project, using the proven power of the TypeScript.

![ts-quick reporting two errors](./media/demo.png)

## Install

```sh
$ npm install --global ts-quick
```

## Usage

```sh
$ ts-quick --help

  ⚡️ Zero configuration static analysis using TypeScript

  Usage
    $ ts-quick [<file|glob> ...]

  Options
    --init         Add ts-quick to your project
    --implicitAny  Allow variables to implicitly have the "any" type
    --ignore       Additional paths to ignore  [Can be set multiple times]
    --cwd=<dir>    Working directory for files

  Examples
    $ ts-quick
    $ ts-quick index.js
    $ ts-quick *.js !foo.js
    $ ts-quick --init
    $ ts-quick --implicitAny
```
