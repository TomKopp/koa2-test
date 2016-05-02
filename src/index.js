#!/usr/bin/env node

"use strict";

import https from 'https';
import fs from 'fs';
import Promise from 'bluebird';
import Koa from 'koa';
import Router from 'koa-router';

let app = new Koa();
let router = new Router();
let options = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.crt')
}

let readFile = Promise.promisify(fs.readFile);



router
  .post('root', '/', async (ctx, next) => {
    try {
      ctx.body = await Promise.resolve('Hello World');
      await next();
    } catch (err) {
      ctx.body = { message: err.message };
      ctx.status = err.status || 500;
    }
  })
  .post('users', '/users', async (ctx, next) => {
    ctx.body = await readFile('./data/users.json', 'utf8').then(text => {
        return JSON.parse(text);
      })
      .catch(err => {
        ctx.status = err.status || 500;
        return { message: err.message };
      });
  });



app
  .use(router.routes())
  .use(router.allowedMethods());

https.createServer(options, app.callback()).listen(3000);
