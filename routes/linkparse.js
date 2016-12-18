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
    var loadLink = utils.main_webpage;
    var linksToPull = [utils.jquery_link];

    jsdom.env(
        loadLink,
        linksToPull,
        function (err, windows) {
            if (err) { throw err;}
            var $ = windows.$;
            var trows = $("tbody").children("tr");
            var currRow = $(trows[0]);
            var tot_len = trows.length;
            var iterator = new It.Iterator();
            iterator.setIterateFunction(function () {
                if (iterator.index == 0) {
                    iterator.length = trows.length;
                    iterator.setVal(conv_Row1(currRow, $));
                    iterator.index++;
                } else if (iterator.index == tot_len){
                    iterator.index = 0;
                }else {
                    currRow = $(currRow).next();
                    iterator.setVal(conv_Row1(currRow, $));
                    iterator.index++;
                } 
            });
            
            callback(iterator.iterate()); //calling the iterator once so that now it points to the first element in the list it is iterating over
        }                                 // this works b/c the iterate() function will return the calling iterate object
    );

    function conv_Row1(tr, $) {
        var classTmp = $(tr).find("b").html()
        var linkTmp = $(tr).children(":nth-child(2)").children("a").attr("href");
        return [classTmp, linkTmp];
    }
}


function iterateClassWebcastLink(classLink, callback) {
    var loadLink = classLink;
    var linksToPull = [utils.jquery_link];

    jsdom.env(
        loadLink,
        linksToPull,
        function (err, windows) {
            if (err) { throw err; }
            var $ = windows.$;
            var trows = $("tbody").children("tr");
            var tot_len = trows.length;
            var currRow = $(trows[0]);
            var iterator = new It.Iterator();
            iterator.setIterateFunction(function () {
                if (iterator.index == 0) {
                    iterator.length = tot_len;
                    iterator.setVal(conv_Row2(currRow, $));
                    iterator.index++;
                } else if (iterator.index == tot_len) {
                    iterator.setVal(null);
                    iterator.index = 0;
                } else{
                    currRow = $(currRow).next();
                    iterator.setVal(conv_Row2(currRow, $));
                    iterator.index++;
                }
            });

            callback(iterator.iterate()); 
        }                                 
    );

    function conv_Row2(tr, $) {
        var index = $(tr).children(":nth-child(2)").find("a").html();
        index = index.slice(index.indexOf("-") + 1);
        index = parseInt(index);
        var linkTmp = $(tr).children(":nth-child(2)").find("a").attr("href");
        //console.log("\nin 2nd link processing-  index: " + index + "  linkTmp: " + linkTmp);
        return [index, linkTmp];
    }
}

function getSpecificVideoLinks(spec_link, callback) {
    var loadLink = spec_link;
    var linksToPull = [utils.jquery_link];
    jsdom.env(
        loadLink,
        linksToPull,
        function (err, window) {
            if (err) {
                return callback(err, null, null);
            }
            var $ = window.$;
            //$("#oc_download-button").trigger("click");
            var div = $("#oc_download_video");
            console.log("\ndiv contentshiJOO: " +  $("body").html());
            var link1 = $(div).children(":nth-child(1)").attr("href");
            var link2 = $(div).children(":nth-child(2)").attr("href");
            callback(err, link1, link2);  //I could just pass null instead of err, b/c at this point in the function the err object has to be undefined or null
        }
    );
}

exports.getSimDOM_ForLink = getSimDOM_ForLink; 

exports.iterateClassWebcastLink = iterateClassWebcastLink;

exports.iterateMainWebcastLink = iterateMainWebcastLink;

exports.getSpecificVideoLinks = getSpecificVideoLinks;
