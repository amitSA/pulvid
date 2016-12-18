var mysql = require('mysql');
var sprintf = require('sprintf');

var utils = require("./util_babies.js");

var pool = mysql.createPool({
    connectionLimit: 1,  //it is 1 just for testing hiJO
    host: "localhost",
    user: "amit",
    password: "mediumnight",
    port: 3306,
    database: "pulvid_schema"
});

var allCLinks_tableName = "AllClassLinks"; 

//The next methods are for Retrieving Links

function db_webcastLinkExist(className, callback) {
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        var sql = sprintf("SELECT webcast_link FROM %s WHERE class_name='%s'",allCLinks_tableName, className);
        connection.query(sql, function (err, rows) {
            //because class_name is a primary_key property, every row has a unique className property, thus only one row's class_name property can match the 'className' var (thus only this row if exists is in the rows object)
            connection.release();
            if (err) {
                return callback(err, null);
            }
            
            if (rows.length > 0) {
                return callback(null,rows[0]["webcast_link"]);
            } else {
                return callback(null,null);
            }
        });
    });

}

function db_queryClasstableRow(className, number, callback) {
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        var sql = sprintf("SELECT * %s WHERE vid_name=%d", className, number);
        connection.query(sql, function (err, rows) {
            connection.release();
            callback(err, rows);
        });

    });

}

exports.db_webcastLinkExist = db_webcastLinkExist;
exports.db_queryClasstableRow = db_queryClasstableRow; 

//The next methods are for Storing links

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
            connection.release();
            if (err) {
                console.log("error with this entry: " + className);
                return callback(err,reply);
            }
            console.log("entry stored: " + className);
            callback(null, reply);  //technically I can pass in the err object b/c if the code did reach this point then the err object would have to be null or undefined
        });

    });        
}
/**
 *
 * @param className - className string represents the class whose table is being added information two
 * @param number - int
 * @param list_link - String
 * @param one_vid_link - String
 * @param two_vid_link - String
 * @param callback - callback function that will hold errors and
 */
function db_storeClassTableLinks(className, number, list_link, one_link, two_link, callback){
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        if (one_link == null) { one_link = 'null'; }  // the table will still store the value as null,b/c there will actually be no wrapping single quotes in the sql string
                         else { one_link = "'" + one_link + "'";}
        if (two_link == null) { two_link = 'null'; }
                         else { two_link = "'" + two_link + "'"; }
        var sql = sprintf("INSERT INTO %s SET vid_name=%d, list_link='%s', 1_vid_link=%s, 2_vid_link=%s ",className,number,list_link,one_link,two_link); //it is intentional for the properties of 1_vid_link and 2_vid_link to not be wrapped in single quotes, in the above statements I allready wrap the strings in single quotes if they are not null
        connection.query(sql, function (err, reply) {
            connection.release();
            callback(err, reply);
        });
    });
}

function db_updateClassTableLinks(className, number, new_list_link,new_1_link,new_2_link, callback) {
    pool.getConnection(function (err, connection) {
        var sql = sprintf("UPDATE %s SET list_link='%s', 1_vid_link=%s, 2_vid_link=%s WHERE number=%d", className, newList_link,new1_link,new2_link,number);
        connection.query(sql, function (err, reply) {
            connection.release();
            callback(err, reply);
        });
    });

}

exports.db_storeWebcastLink = db_storeWebcastLink;
exports.db_storeClassTableLinks = db_storeClassTableLinks;
exports.db_updateClassTableLinks = db_updateClassTableLinks;

//Methods for table creation/insertion and state checking

/**
 * @param tableName
 * @param callback - takes in 2 arguments: callback(err, exist)
                       - err: a non-null object if there was an error in the query operation, null otherwise (or if the underlying query encountered no errors)
                       - exist: a boolean containing false if table does not exist or if error object is defined, true otherwise (if table does exist)
                       
 */
function db_tableExist(tableName, callback) {
    pool.getConnection(function (err, connection) {
        var sql = sprintf("SELECT * FROM %s LIMIT 1", tableName);
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err || rows.length==0) {
                return callback(err, false);
            }
            callback(err, true);                
        }); 
    });
}
function db_createClassTable(className, callback) {
    pool.getConnection(function (err, connection) {
        var sql = sprintf("CREATE TABLE %s (number INT NOT NULL," +
            "list_link VARCHAR(255) NOT NULL" +
            "1_vid_link VARCHAR(255)," +
            "2_vid_link VARCHAR(255)", className);
        connection.query(sql, function (err, reply) {
            connection.release();
            callback(err, reply);
        });

    });
}
function db_createStoreClassTableLinks(className, number, list_link, one_link, two_link, callback) {
    db_createClassTable(className, function (err, reply) {
        if (err) {
            console.log("err in creating table in db_createStoreClassTableLinks");
            throw err;
        }
        db_storeClassTableLinks(className, number, list_link, one_link, two_link, callback);
    });
}

exports.db_tableExist = db_tableExist;
exports.db_createClassTable = db_createClassTable;
exports.db_createStoreClassTableLinks = db_createStoreClassTableLinks;