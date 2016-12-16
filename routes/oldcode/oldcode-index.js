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


//it was at the top, but under all the require statements of index.js
db.db_storeWebcastLink("node_class17", "nodelink17", function (err, reply) {
    if (err) {
        console.log("Error in 2nd main callback function: ");
        utils.printAllKeyValues(err);
        return;
    }
    console.log("[index.js]: test row was added)");
});