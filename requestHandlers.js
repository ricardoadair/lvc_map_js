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

function select(response, postData, urlString) {
    
    con.connect(
        function(err) {
            if (err) console.log(err);
            //console.log("Connected!");
            //console.log(postData);
						var query = " SELECT \
								shd.id AS id, \
								sd.nombre AS nombre, \
								X(shd.geopunto) AS longitude, \
								Y(shd.geopunto) AS latitude, \
								shd.dispositivo_m2o_id AS dispositivo_id, \
								sd.opciones AS dispositivo_opciones \
							FROM ss_historial_dispositivo shd \
							INNER JOIN ss_dispositivo sd \
							ON sd.id = shd.dispositivo_m2o_id; \
						";
						/*var dispositivo_id = 2;
						var query = " \
							SELECT \
								shd.id AS id,\
								sd.nombre AS nombre,\
								X(shd.geopunto) AS longitude,\
								Y(shd.geopunto) AS latitude, \
								shd.dispositivo_m2o_id AS dispositivo_id \
							FROM ss_historial_dispositivo shd\
							INNER JOIN ss_dispositivo sd\
							ON sd.id = shd.dispositivo_m2o_id\
							WHERE shd.dispositivo_m2o_id = "+ dispositivo_id +" ;\
						";*/
            con.query(
                query,
                function (err, result, fields) {
                    if (err) console.log( err );
										console.log("Query success");
                    //console.log(result);
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
																dispositivo_opciones : result[r].dispositivo_opciones,
                            }
                        );
                        //console.log(result[r]);
                    }
                    
                    var json = JSON.stringify(
                        array
                    );
                    if (urlString.queryparam.callback && urlString.queryparam.callback != '?') {
                        //console.log('jsonp');
                        json = urlString.queryparam.callback + "(" + json + ");";
                    }
                    response.writeHead( 200, {"Content-Type": "application/json", 'content-length':json.length } );
                    response.end(json);
                }
            );
        }
    );
}

exports.select = select;