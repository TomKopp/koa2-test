#!/usr/bin/env node


"use strict";

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

let app = new _koa2.default();
let router = new _koaRouter2.default();
let options = {
  key: _fs2.default.readFileSync('./ssl/server.key'),
  cert: _fs2.default.readFileSync('./ssl/server.crt')
};

let readFile = _bluebird2.default.promisify(_fs2.default.readFile);

router.post('root', '/', (() => {
  var ref = _asyncToGenerator(function* (ctx, next) {
    try {
      ctx.body = yield _bluebird2.default.resolve('Hello World');
      yield next();
    } catch (err) {
      ctx.body = { message: err.message };
      ctx.status = err.status || 500;
    }
  });

  return function (_x, _x2) {
    return ref.apply(this, arguments);
  };
})()).post('users', '/users', (() => {
  var ref = _asyncToGenerator(function* (ctx, next) {
    ctx.body = yield readFile('./data/users.json', 'utf8').then(function (text) {
      return JSON.parse(text);
    }).catch(function (err) {
      ctx.status = err.status || 500;
      return { message: err.message };
    });
  });

  return function (_x3, _x4) {
    return ref.apply(this, arguments);
  };
})());

app.use(router.routes()).use(router.allowedMethods());

_https2.default.createServer(options, app.callback()).listen(3000);