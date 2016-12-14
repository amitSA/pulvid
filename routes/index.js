var express = require('express');
var router = express.Router();

var jsdom = require('jsdom');


/* GET home page. */
router.get(/\/abc|\/efg/, function (req, res) { 
    var array = [];
    for (var i = 0; i < req.params.length; i++) {
        array.push(req.params[i].toString());
    }
    //var fruits = ["Banana", "Orange", "Apple", "Mango"];
    console.log("array of params:" + (array.toString())); 
    res.send("in second get route");

    res.send('in first route');
});

router.get(/(foo)(goo)abc/, function (req, res, next) {
    var i = 0;
    while (typeof (req.params[i]) != "undefined") {
        console.log("param[" + i + "]: " + req.params[i]);
        i++;
    }
    res.send("in second get route");
});
/**Throughout this route, req.className and req.linkG are two properties that are added to the req object **/
router.get(/(.+)(?:%20|\+)(.+)\/(?:number|number\/)$/, function logReqClassName (req, res, next) {
    console.log("\nRequest url: " + req.url)
    var i = 0;
    while (typeof (req.params[i]) != "undefined") {
        console.log("param[" + i + "]: " + req.params[i]);
        i++;
    }
    var cName = req.params[0] + " " + req.params[1];
    cName = cName.charAt(0) == '/' ? cName.slice(1) : cName;
    req.className = cName;
    next();
}, function retrieveLink (req, res, next) {
    console.log("parsed className: " + req.className);
    jsdom.env("https://webcast.ucsc.edu",
        ["https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"],
        function (err, windows) {
            if (err) {
                console.log("jsdom error while trying to load to main webcast-course-link");
                return;
            }
            console.log("hijOO website title: " + windows.$("#contentHeaderTitle").html());
            var trows = windows.$("tbody").first().children("tr");
            windows.$(trows).each(function (index) {
                if (windows.$(this).find("b").html() == req.className) {
                    console.log("MATCH FOUND with class: " + req.className);
                    var td = windows.$(this).children(":nth-child(2)");
                    var link = windows.$(td).children("a").attr("href");
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

var db = require("./database.js");
db.execute();

module.exports = router;