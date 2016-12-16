var express = require('express');
var router = express.Router();

//requiring external modules
var jsdom = require('jsdom');

//requiring this project's js files
var db = require("./database.js");
var linkParse = require("./linkparse.js");
var utils = require("./util_babies.js");





/**Throughout this route, req.className and req.linkG are two properties that are added to the req object **/
router.get(/(.+)(?:%20|\+)(.+)\/(?:number|number\/)$/, function logReqClassName (req, res, next) {
    //console.log("\nRequest url: " + req.url)
    var i = 0;
    while (typeof (req.params[i]) != "undefined") {
        //console.log("param[" + i + "]: " + req.params[i]);
        i++;
    }
    var cName = req.params[0] + " " + req.params[1];
    cName = cName.charAt(0) == '/' ? cName.slice(1) : cName;
    req.className = cName;
    next();
}, function retrieveLink (req, res, next) {
    console.log("parsed className: " + req.className);
    db.db_webcastLinkExist(req.className, function (err, linkRet) {
        if (err) { throw err; }
        if (linkRet != null) {
            console.log(req.className + " link was retrieved from database");
            req.linkG = linkRet;
            return next();
        }
        linkParse.getSimDOM_ForLink("https://webcast.ucsc.edu", true,
        function (err, windows) {
            if (err) {
                console.log("jsdom error while trying to load to main webcast-course-link");
                return;
            }
            console.log("'AllClasses' Website Title: " + windows.$("#contentHeaderTitle").html());
            var trows = windows.$("tbody").first().children("tr");
            windows.$(trows).each(function (index) {
                var td = windows.$(this).children(":nth-child(2)");
                var link = windows.$(td).children("a").attr("href");
                var currClass = windows.$(this).find("b").html();
                db.db_storeWebcastLink(currClass, link, function (err, reply) {
                    if (err) {
                        if (err.errno === 1062) { //1062 is the error code for an ER_DUP_ENTRY_WITH_KEY_NAME result from an 'insert' query
                            return console.log("[index.js]:Duplicate Entry Error ignored in 'retrieveLink' callback");
                        }
                        throw err; //else, if the error was not the checked error above, throw it and exit/crash the hIJOO program
                    } 
                });
                if (currClass == req.className) {
                    console.log("MATCH FOUND with class: " + req.className);
                    console.log(link);
                    req.linkG = link;
                    return next();
                }
            });
            if (req.linkG == null) {
                var msg = "no class was found matching the url paramter";
                console.log(msg);
                res.send(msg);  //if code reaches this point, then send the response and cease the calling of any more callbacks for this route 
            }
        });
    });
}, function countWebcasts (req, res, next) {
    console.log("in third callback function");
    jsdom.env(req.linkG,
        ["https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"],
        function (err, windows) {
            console.log(req.className + " page's title: " + windows.$("#contentHeaderTitle").html());
            var trows = windows.$("tbody").first().children("tr");
            console.log(req.className + "'s number of recordings: " + trows.length);

            res.send("Number of videos for " + req.className + ": " + trows.length);
        });
});

router.get("/testt", function (req, res, next) {

    linkParse.iterateMainWebcastLink(function (iterator) {

        for (var i = 0; i < iterator.length; i++) {
            console.log(iterator.getVal());
            iterator.iterate();
        }

    });
    res.send("In test route");
    
});


/*var dbTest = require("./database_test.js");
dbTest.execute();*/

module.exports = router;