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
            var iterator = new It.Iterator(trows.length, $(currRow).find("b").html(), function () {
                currRow = $(currRow).next();
                this.value = $(currRow).find("b").html();
            });
            callback(iterator);
        }
    );


}

exports.getSimDOM_ForLink = getSimDOM_ForLink; 

exports.iterateMainWebcastLink = iterateMainWebcastLink;