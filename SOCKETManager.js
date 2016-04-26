var socket = require('socket.io');
var path = require('path');
var fs = require('fs');

module.exports.SOCKETManager = function(config, routing, app){
  var __config = config,
    __routing = routing,
    __app = app,
    __io,
    __route,
    __controller;

  var startServer = function(){
    __io = socket(__app);
    __io.on('connection', function(socket){
      for(var i in __routing){
        __route = __routing[i];
        if(__route.type == 'socket'){
          pathFile = path.join(__dirname+"/app/controllers/", __route.Controller.name + "ControllerS.js");
          try {
            __controller = eval(fs.readFileSync(pathFile).toString());
            __controller.SOCKET = socket;
            __controller.IO = __io;
            __controller[__route.Controller.action]();
            for(var b in __route.Controller.events){
              socket.on(__route.Controller.events[b], __controller[__route.Controller.events[b]]);
            }
          } catch (e) {
            console.log(e);
          }
          console.log("CONTROLLER " + __route.Controller.name);
        }
      }
    });
  };

  return {
    startServer:startServer
  };
};
