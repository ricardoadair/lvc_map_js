var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
//handle["/"] = requestHandlers.select;
handle["/select"] = requestHandlers.select;

server.iniciar(router.route, handle);