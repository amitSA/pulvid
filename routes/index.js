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
        linkParse.iterateMainWebcastLink(function (iterator) {
            if (err) {
                console.log("jsdom error while trying to load to main webcast-course-link");
                return;
            }
            while (iterator.index!=0) {
                var retVal = iterator.getVal();
                var currClass = retVal[0], link = retVal[1];
                iterator.iterate();
                db.db_storeWebcastLink(currClass, link, function (err, reply) {
                    if (err) {
                        if (err.errno === 1062) { //1062 is the error code for an ER_DUP_ENTRY_WITH_KEY_NAME result from an 'insert' query
                            return;// console.log("[index.js]:Duplicate Entry Error ignored in 'retrieveLink' callback");
                        }
                        throw err; //else, if the error was not the checked error above, throw it and exit/crash the hIJOO program
                    }
                });
                if (currClass == req.className) {
                    console.log("MATCH FOUND with class: " + req.className);
                    req.linkG = link;
                    return next();
                }
            }
            if (req.linkG == null) {
                var msg = "no class was found matching the url paramter";
                console.log(msg);
                res.send(msg);  //if code reaches this point, then send the response and cease the calling of any more callbacks for this route 
            }
        });
    });
}, function countWebcasts (req, res, next) {
    console.log("in third callback function");
    linkParse.iterateClassWebcastLink(req.linkG, function (iter) {
        var resp_msg = req.className + " has " + iter.length + " webcast videos";
        console.log(resp_msg);
        res.send(resp_msg);
    });


});

router.get("/testt", function (req, res, next) {

   

    var link = utils.ams203_v18Link;
    linkParse.getSpecificVideoLinks(link, function (err, link1,link2) {
        if (err) {
            console.log("Error in /test route hIJO in index.js: error occured in trying to get the presentation and presenter links from the test ams203-18th-lecture- link");
            throw err;
        }
        //console.log("link1: " + link1 + "  link2: " + link2);
        //res.send("link1: " + link1 + "  link2: " + link2);
        res.send(link1);
    })
    
});


/*var dbTest = require("./database_test.js");
dbTest.execute();*/

module.exports = router;