var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}

handle["/select"] = requestHandlers.select;
handle["/selectLast"] = requestHandlers.select;

server.iniciar(router.route, handle);