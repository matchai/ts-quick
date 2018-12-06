<div align="center">
  <img alt="lightning bolt" src="./media/logo.svg" width=100px>
</div>
<h3 align="center">ts-quick ⚡️</h3>
<p align="center">Zero configuration JavaScript static analysis</p>

---

Easily enforce JSDoc types throughout your JavaScript project, using the proven power of the TypeScript.

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
