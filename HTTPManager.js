var http = require('http');
var swig = require('swig');
var parse = require('url').parse;
var mime = require('mime');
var path = require('path');
var fs = require('fs');
var r = require('rethinkdb');
var formidable = require('formidable');

var mainController = require('./lib/Controller.js');

module.exports.HTTPManager = function(config, routes){
  var __config = config,
    __routes = routes,
    __root = __dirname,
    __pathFile,
    __stream,
    __conn,
    __ids;

  var findRoute = function(urlPath){
    var routeMatcher;
    for(var route in __routes){
      routeMatcher = route == urlPath;
      if(route.indexOf(':') != -1) routeMatcher = urlPath.match(new RegExp(route.replace(/:[^\s/]+/g, '([\\w-]+)')));
      if(routeMatcher){
        __ids = routeMatcher[1];
        return __routes[route];
      }
    }
    return null;
  };

  var send404 = function (res){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write("Error 404: file not found");
  };

  var sendHTML = function(res, body){
    res.setEncoding('utf8');
    res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': Buffer.byteLength(body)});
    res.write(body);
  };

  var merge_options = function (obj1,obj2){
    var obj3 = {};
    for (var atr in obj1) { obj3[atr] = obj1[atr]; }
    for (var atr in obj2) { obj3[atr] = obj2[atr]; }
    return obj3;
  };

  var parseForm = function(req, res, cb){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, field, files){
      console.log(fields);
      console.log(files);
      cb(fields, files);
    });
  };

  var trySetVar = function(res, req, controller, get, callback){
    var item = '';
    try{
      controller.REQ = req;
      controller.RES = res;
    }catch(e){
      console.log("Couldn't set REQ to the Controller");
    }
    switch(req.method){
      case 'POST':
        req.setEncoding('utf8');
        req.on('data', function(char){
          item += char;
        });
        req.on('end', function(){
          try{
            this.parseForm(req, res, function(fields, files){
              controller.POST.fields = fields;
              controller.POST.files = files;
              callback(controller);
            });
          }catch(e){
            console.log("Couldn't set POST to the Controller");
          }
        });
        break;
      case 'GET':
        try{
          controller.GET = get;
        }catch(e){
          console.log("Couldn't set GET to the Controller");
        }
        callback(controller);
        break;
    }
  };

  var octet_stream = function(res, req, url){
    var urlPath = url.pathname,
      get = url.query;

    var route = findRoute(urlPath);
    console.log(route);
    if(route){
      var Controller = route.Controller.name;
      var Action,
        View;
      if(typeof route.Controller.action != 'undefined'){
        Action = route.Controller.action;
      }else{
        Action = "index";
      }
      if(typeof route.View != 'undefined'){
        View = route.View + "." + __config.template;
      }else{
        View = "index" + "." + __config.template;
      }
      __pathFile = path.join(__root+"/app/controllers/", Controller + "Controller.js");
      try {
        __stream = eval(fs.readFileSync(__pathFile).toString());
      } catch(c) {
        try{
          __pathFile = path.join(__root+"/app/controllers/MainController.js");
          __stream = eval(fs.readFileSync(__pathFile).toString());
        }catch(e){
          send404(res);
          console.log(e);
          return;
        }
      }
      trySetVar(res, req, __stream, get, function(cont){
        __stream = cont;
        mainController.VIEW = View;
        mainController.ROOT = __root;
        mainController.ARG = __ids;
        mainController.EXTENSION = "." + __config.template;
        __stream = merge_options(__stream, mainController);
        __stream[Action](function(data){
          res.write(data);
          res.end();
        });
      });
    }else{
      send404(res);
    }
  };

  var startServer = function (conn) {
    mainController.r = r;
    mainController.conn = conn;
    this.server = http.createServer(function (req, res){
      var url = parse(req.url, true);
      var type = mime.lookup(path.extname(url.path));
      console.log(url.path);
      switch (type) {
        case "application/octet-stream":
          console.log(req.connection.remoteAddress);
          octet_stream(res, req, url);
          break;
        default:
          __pathFile = path.join(__root+"/assets/", url.pathname);
          console.log(__pathFile);
          res.setHeader('Content-Type', type);
          __stream = fs.createReadStream(__pathFile);
          __stream.on('error', function(err){ console.log(err); res.end(); });
          __stream.pipe(res);
          return;
      }
    });
    this.server.listen(__config.port);
    console.log("Server started at the http://localhost:" + __config.port);
    return this.server;
  };

  return{
    startServer:startServer
  };
};
