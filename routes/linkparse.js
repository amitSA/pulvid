//requing external modules
var jsdom = require('jsdom');

//requiring js files created for this project
var utils = require("./util_babies");
var It = require("./Iterator.js");

/**
 * @param link: String
 * @param jquery_attached: boolean
 * @param callback: callback function
 */
function getSimDOM_ForLink(link, jquery_attached, callback) {
    var linksToPull = jquery_attached ? [utils.jquery_link] : []; 
    jsdom.env(
        link,
        linksToPull,
        function (err, windows) {
            return callback(err, windows);
        }
    );
};

function iterateMainWebcastLink(callback) {
    var mainLink = utils.main_webpage;
    var linksToPull = [utils.jquery_link];

    jsdom.env(
        mainLink,
        linksToPull,
        function (err, windows) {
            if (err) { throw err;}
            var $ = windows.$;
            var trows = $("tbody").children("tr");
            var currRow = $(trows[0]);
            var initVal = conv_Row(currRow,$);  
            var iterator = new It.Iterator();
            iterator.setIterateFunction(function () {
                if (iterator.getVal() == null) {
                    iterator.length = trows.length;
                    iterator.setVal(conv_Row(currRow, $));
                } else {
                    currRow = $(currRow).next();
                    iterator.setVal(conv_Row(currRow, $));
                } 
            });
            
            callback(iterator.iterate()); //calling the iterator once so that now it points to the first element in the list it is iterating over
        }                                 // this works b/c the iterate() function will return the calling iterate object
    );

    function conv_Row(tr, $) {
        var classTmp = $(tr).find("b").html()
        var linkTmp = $(tr).children(":nth-child(2)").children("a").attr("href");
        return [classTmp, linkTmp];
    }
}

exports.getSimDOM_ForLink = getSimDOM_ForLink; 

exports.iterateMainWebcastLink = iterateMainWebcastLink;