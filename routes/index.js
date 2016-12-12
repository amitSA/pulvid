var express = require('express');
var router = express.Router();



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

router.get(/(.+)\W(\w+)/, function (req, res, next) {
    var i = 0;
    while (typeof (req.params[i]) != "undefined") {
        console.log("param[" + i + "]: " + req.params[i]);
        i++;
    }
    next();
}, function (req, res, next) {
    res.send("in next functionnn for this route, in second get route");

});


module.exports = router;