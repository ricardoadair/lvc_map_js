var http = require("http");
var url = require("url");
var querystring = require("querystring");

function iniciar(route, handle)
{
	function onRequest(request, response)
	{
		var dataPosteada = "";
		var pathname = url.parse(request.url).pathname;
		var urlString =
		{
			pathname: url.parse(request.url).pathname,
			queryparam: querystring.parse(url.parse(request.url).query)
		};
		console.log("Peticion para " + pathname + " recibida.");
		
		request.setEncoding("utf8");

		request.addListener
		(
			"data",
			function(trozoPosteado)
			{
				dataPosteada += trozoPosteado;
				console.log("Recibido trozo POST '" + trozoPosteado + "'.");
			}
		);

		request.addListener
		(
			"end",
			function()
			{
					route(handle, pathname, response, dataPosteada, urlString);
			}
		);

	}
	http.createServer(onRequest).listen(8888);
	console.log("Servidor Iniciado");
}

exports.iniciar = iniciar;