#!/usr/bin/env node
// @ts-check
'use strict';
const PATH = require('path');
const FS = require('fs');
const REQUEST = require('request');

const BRANCH = process.env.CIRCLE_BRANCH;
const SHA1 = process.env.CIRCLE_SHA1;
const REPO = process.env.CIRCLE_REPOSITORY_URL;
const USERNAME = process.env.CIRCLE_USERNAME;

const URI = 'https://mas-o-menos.herokuapp.com/api/stats';
const CURRENT = process.argv[1];
const BASE = PATH.join(CURRENT, '..', '..', '..', 'stats');

const WEBPACK = PATH.join(BASE, 'webpack.json');
const LIGHTHOUSE = PATH.join(BASE, 'lighthouse.json');

const WEBPACK_DATA = JSON.parse(FS.readFileSync(WEBPACK).toString());
const LIGHTHOUSE_DATA = JSON.parse(FS.readFileSync(LIGHTHOUSE).toString());

const DATA = {
  username: USERNAME,
  branch: BRANCH,
  sha1: SHA1,
  repo: REPO,
  webpack: WEBPACK_DATA,
  lighthouse: LIGHTHOUSE_DATA,
};

REQUEST({uri: URI, json: DATA, method: 'POST'});
