


function Iterator(_iterate,length, initialVal) {
    this.length = length;
    this._iterate = _iterate; //iterate should be a function that will be called when ever client calls nextElement();
    this.value = initialVal;
    this.nextElement = function () {
        this.iterate();
    }
}