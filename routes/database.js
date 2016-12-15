var mysql = require('mysql');
var sprintf = require('sprintf');

var utils = require("./util_babies.js");

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "amit",
    password: "mediumnight",
    port: 3306,
    database: "pulvid_schema"
});

var allCLinks_tableName = "AllClassLinks"; 

//The next two methods are for Retrieving Links

function db_webcastLinkExist(className, callback) {
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        var sql = sprintf("SELECT webcast_link FROM %s WHERE class_name='%s'",allCLinks_tableName, className);
        //console.log("Sql in db_webcast...: " + sql);
        connection.query(sql, function (err, rows) {
            //because class_name is a primary_key property, every row has a unique className property, thus only one row's class_name property can match the 'className' var (thus only this row if exists is in the rows object)
            if (err) {
                return callback(err, null);
            }
            connection.release();
            utils.printAllKeyValues(rows);
            if (rows.length > 0) {
                return callback(null,rows[0]["webcast_link"]);
            } else {
                return callback(null,null);
            }
        });
    });

}

function db_recordingLinkExist(className, number) {


}

exports.db_webcastLinkExist = db_webcastLinkExist;
exports.db_recordingLinkExist = db_recordingLinkExist; 

//The next two methods are for Storing links

/** 
 *  This method adds a new row into the AllClassLinks Table with the passed in properties.  It also takes in a callback argument that will be called on a succesful or failed completion of this method
 * @param className: value for class_name property 
 * @param link: value for webcast_link property
 * @param callback: callback function called once the data is entered into the table, takes an err argument if an error was encountered in the INSERT query this method does internally 
 */
function db_storeWebcastLink(className, link, callback) {
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        var sql = sprintf("INSERT INTO %s (class_name,webcast_link) VALUES ('%s','%s')", allCLinks_tableName, className, link); 
        //console.log("sql: " + sql);
        connection.query(sql, function (err, reply) {
            if (err) {
                return callback(err,reply);
            }
            connection.release();
            callback(null, reply);  //technically I can pass in the err object b/c if the code did reach this point then the err object would have to be null or undefined
        });

    });        
}

exports.db_storeWebcastLink = db_storeWebcastLink;