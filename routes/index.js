﻿var express = require('express');
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

var className = "";
router.get(/(.+)(?:%20|\+)(.+)\/(?:number|number\/)$/, function (req, res, next) {
    console.log("\nRequest url: " + req.url)
    var i = 0;
    while (typeof (req.params[i]) != "undefined") {
        console.log("param[" + i + "]: " + req.params[i]);
        i++;
    }
    next();
}, function (req, res, next) {
    var className = req.params[0] + " " + req.params[1];
    className = className.charAt(0) == '/' ? className.slice(1) : className;
    console.log("parsed className: " + className);
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
                if (windows.$(this).find("b").html() == className) {
                    console.log("MATCH FOUND with class: " + className);
                    var td = windows.$(this).children(":nth-child(2)");
                    var link = windows.$(td).children("a").attr("href");
                    console.log(link); 
                }
            });
            //console.log(windows.$(trows).first().html());
        });
    res.send("in next functionnn for this route, in second get route");

});


module.exports = router;