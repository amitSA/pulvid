
exports.jquery_link = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js";

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



