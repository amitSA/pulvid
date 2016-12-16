


function Iterator() {
    var value = null;
    var _iterate = null;
   
    this.length = null;
    this.setIterateFunction = function (func) {
        _iterate = func;
    }
    this.iterate = function () {
        _iterate();
        return this;
    }
    this.getVal = function () {
        return value;
    }
    this.setVal = function (v) {
        value = v;
    };
    /*this.iterate = function () { //HoOLLHYYSHItEEE!!!!, hijOandupandU, I realized that if I 'wrap' or call the callback function inside a member function, rather than just equate the member function to the callback, then encapsulation is achieved b/c whoever implemented the callback function cannot access private member variables.  HOWever, if I did it the other way(set  member function equal to callback) then the callback function could call private variables of this object
       _iterate();
    }*/
}

exports.Iterator = Iterator;
