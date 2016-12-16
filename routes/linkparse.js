//requing external modules
var jsdom = require('jsdom');

//requiring js files created for this project
var utils = require("./util_babies");

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



exports.getSimDOM_ForLink = getSimDOM_ForLink; 