


function Iterator(len, initialVal,_iterate) {
    var value = initialVal;
    this.iterate = function () {
       _iterate();
    }
    this.get = function () {
        return value;
    }
    this.length = function () {
        return len;
    }
}

exports.Iterator = Iterator;
