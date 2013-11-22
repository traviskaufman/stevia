var path = require('path');

global.BASE_DIR = path.resolve(path.join(__dirname, '..'));
global.assert = require('chai').assert;
global.sinon = require('sinon');
