var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "amit",
    password: "mediumnight",
    port: 3306,
    database: "pulvid_schema"
});

var allCLinks_tableName = "AllClassLinks"; 

function db_webcastLinkExist(className, callback) {
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        connection.query("SELECT webcast_link FROM " +
            allCLinks_tableName + " WHERE class_name=" + className,
            function (err, rows) {
                //because class_name is a primary_key property, every row has a unique className property, thus only one row's class_name property can match the 'className' var (thus only this row if exists is in the rows object)
                connection.release();
                if (rows.length > 0) {
                    callback(true, rows[0].class_name);
                } else {
                    callback(false,null);
                }
        });
    });

}

function db_recordingLinkExist(className, number) {


}

exports.db_webcastLinkExist = db_webcastLinkExist;
exports.db_recordingLinkExist = db_recordingLinkExist; 

