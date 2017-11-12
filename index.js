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
const BUILD_NUMBER = process.env.CIRCLE_BUILD_NUM;

const URI = 'https://mas-o-menos.herokuapp.com/api/stats';
const CURRENT = process.argv[1];
const BASE = PATH.join(CURRENT, '..', '..', '..', 'stats');

const WEBPACK = PATH.join(BASE, 'webpack.json');
const LIGHTHOUSE = PATH.join(BASE, 'lighthouse.json');
const COVERAGE = PATH.join(BASE, '..', 'coverage', 'lcov.info');

const WEBPACK_DATA = safeRead(WEBPACK);
const LIGHTHOUSE_DATA = safeRead(LIGHTHOUSE);
const COVERAGE_DATA = safeRead(COVERAGE);

const DATA = {
  buildNumber: BUILD_NUMBER,
  username: USERNAME,
  branch: BRANCH,
  sha1: SHA1,
  repo: REPO,
  webpack: WEBPACK_DATA ? JSON.parse(WEBPACK_DATA) : null,
  lighthouse: LIGHTHOUSE_DATA ? JSON.parse(LIGHTHOUSE_DATA) : null,
  coverage: COVERAGE_DATA || null,
};

REQUEST({uri: URI, json: DATA, method: 'POST'});


function safeRead(path) {
    let data;
    try {
        data = FS.readFileSync(path).toString();
    } catch (e) {
        console.log('Stats file not found', path);
        data = null;
    }

    return data;
}