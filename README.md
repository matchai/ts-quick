<p align="center">
  <img alt="lightning bolt" src="./media/logo.png" width=100px>

<h3 align="center">ts-quick️</h3>
<p align="center">Zero-configuration JavaScript static analysis tool</p>
<p align="center"><a href="https://travis-ci.org/matchai/ts-quick"><img src="https://badgen.net/travis/matchai/ts-quick" alt="Build Status"></a></p>
</p>

---

![will be available on npm in 24 hours](./media/temp-banner.png)

Easily catch bugs and enforce JSDoc types throughout your JavaScript project using the proven power of TypeScript.
Either use it as a standalone CLI, or add it to your test script to ensure that your JS the best it can be.

![ts-quick reporting two errors](./media/demo.png)

## Install

```
$ npm install --global ts-quick
```

## Usage

```
$ ts-quick --help

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

## License

ISC © [Matan Kushner](https://matchai.me/)

### Attribution

The ts-quick logo is a derivative of the "flash-outline" icon in [Typicons](https://github.com/stephenhutchings/typicons.font) by [stephenhutchings](https://github.com/stephenhutchings), used under [CC BY-SA](https://creativecommons.org/licenses/by-sa/3.0/).<br>The ts-quick logo is licensed under [CC BY-SA](https://creativecommons.org/licenses/by-sa/3.0/) by [Matan Kushner](https://matchai.me/).
