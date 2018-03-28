var querystring = require("querystring");
var mysql = require('mysql');

var con = mysql.createConnection(
	{
		host: "localhost",
		user: "root",
		password: "root",
		database: "serverdb"
	}
);

function select(response, postData, urlString)
{
	var what_query = 0;
	if (urlString && "pathname" in urlString)
	{
		if (urlString["pathname"] == "/select")
		{
			what_query = 1;
		}
		else if (urlString["pathname"] == "/selectLast")
		{
			what_query = 2;
		}
	}
	con.connect(
		function(err)
		{
			if (err) console.log(err);
			if (what_query == 1 || what_query == 2)
			{
				var query = "";
				if (what_query == 1)
				{
					query = "\
						SELECT \
							shd.id AS id, \
							sd.nombre AS nombre, \
							X(shd.geopunto) AS longitude, \
							Y(shd.geopunto) AS latitude, \
							shd.dispositivo_m2o_id AS dispositivo_id, \
							shd.fecha_registro AS fecha_registro, \
							sd.opciones AS dispositivo_opciones, \
							shd.opciones AS opciones \
						FROM ss_historial_dispositivo shd \
						INNER JOIN ss_dispositivo sd \
						ON sd.id = shd.dispositivo_m2o_id \
						ORDER BY shd.fecha_registro; \
					";
				}
				else if (what_query == 2)
				{
					query = "\
						SELECT \
							shd.id AS id, \
							sd.nombre AS nombre, \
							X(shd.geopunto) AS longitude, \
							Y(shd.geopunto) AS latitude, \
							shd.dispositivo_m2o_id AS dispositivo_id, \
							shd.fecha_registro AS fecha_registro, \
							sd.opciones AS dispositivo_opciones, \
							shd.opciones AS opciones \
						FROM ss_historial_dispositivo shd \
						INNER JOIN ss_dispositivo sd \
						ON sd.id = shd.dispositivo_m2o_id \
						WHERE fecha_registro in( \
							SELECT MAX(fecha_registro) \
								FROM ss_historial_dispositivo \
							WHERE dispositivo_m2o_id = shd.dispositivo_m2o_id \
						); \
					";
				}
				if (query != '')
				{
					con.query(
						query,
						function (err, result, fields)
						{
							if (err) console.log( err );
							console.log("Query success");
							var array = [];
							for(var r=0;r<result.length;r++)
							{
								array.push(
									{
										id : result[r].id,
										nombre : result[r].nombre,
										dispositivo_id : result[r].dispositivo_id,
										latitude : result[r].latitude,
										longitude : result[r].longitude,
										fecha_registro : result[r].fecha_registro,
										opciones : result[r].opciones,
										dispositivo_opciones : result[r].dispositivo_opciones,
									}
								);
							}
							
							var json = JSON.stringify( array );
							if (urlString.queryparam.callback && urlString.queryparam.callback != '?')
							{
									json = urlString.queryparam.callback + "(" + json + ");";
							}
							response.writeHead(
								200,
								{
									"Content-Type": "application/json",
									'content-length':json.length
								}
							);
							response.end(json);
						}
					);
				}
			}
			
		}
	);
}

exports.select = select;
