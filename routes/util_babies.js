﻿
exports.jquery_link = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js";
exports.main_webpage = "https://webcast.ucsc.edu/";

//for testing out a linkparse.js function
exports.ams131_link = "http://matterhorn2-util.lt.ucsc.edu/search/?checkForLogin&seriestitle=AMS-203-LEC-01-2168-22870"; 
exports.ams203_v18Link = "http://matterhorn2-player-1.lt.ucsc.edu:8080/engage/ui/player.html?id=b5c83880-6306-4a9e-a7f8-7ba09fab5d02";


exports.printAllKeyValues = function (obj) {
    unwind(1, obj);
}

function unwind(indent, obj) {
    
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        for (var j = 0; j < indent; j++) {
            p_write("\t");
        }
        p_write("["+keys[i]+"]: ");
        if (typeof obj[keys[i]] === 'object') {
            p_write("\n");
            unwind(indent + 1, obj[keys[i]]);
        } else {
            p_write(obj[keys[i]]);
            p_write("\n");
        }
        
    }

}
function p_write(str) {
    process.stdout.write(str.toString());
}



