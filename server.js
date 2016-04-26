var config = require('./config.json');
var routing = require('./routes.json');
var httpManage = require('./HTTPManager');
var socketManage = require('./SOCKETManager');
var r = require('rethinkdb');
var cache = {};

r.connect({host: 'localhost', port: 28015, db: 'bs'}, function(err, conn){
  if(err) throw err;
  httpManage.HTTPManager(config, routing).startServer(conn);
  socketManage.SOCKETManager(config, routing, httpManage.server).startServer();

});
