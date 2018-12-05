#!/usr/bin/env node
'use strict';
const resolveCwd = require('resolve-cwd');

const localCLI = resolveCwd.silent('ts-quick/cli');

if(localCLI) {
  const debug = require('debug')('ts-quick');
  debug('Using local install of ts-quick');
  require(localCLI);
} else {
  require('./cli-main');
}
