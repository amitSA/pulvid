//var express = require('express');

var mysql = require('mysql');

exports.execute = function () {
    var pool = mysql.createPool({
        connectionLimit: 10,
        host: "localhost",
        user: "amit",
        password: "mediumnight",
        port: 3306,
        database: "pulvid_schema"
    });

    pool.getConnection(function (err, connection) {
        if (err) {
            //connection.release();
            throw err;
        }
        console.log("Connection was established");
        console.log("Connection thread id: " + connection.threadId);

        connection.query("SELECT * FROM AllClassLinks", function (err, rows) {
            if (err) { throw err; }
            var keys = rows.length > 0 ? Object.keys(rows[0]) : null; //thus keys object will be null if rows[0] does not exist, but since rows.length == 0, the for loop will never run
            for (var i = 0; i < rows.length; i++) {
                console.log("row[" + i + "]: ")
                for (var j = 0; j < keys.length; j++) {
                    console.log("       " + rows[i][keys[j]]);
                }
            }
            connection.release();
        });

        
    });
}   

/**This is for closing all connecions on the pool, after this method call the pool can no longer open any connections and this call guarantees that all connections have ended gracefully (soo I think its not really possible for an error to come in the general case)
pool.end(function (err) {
  // all connections in the pool have ended
});
**/