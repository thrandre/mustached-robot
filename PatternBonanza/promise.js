var Rejection = (function () {
    function Rejection() {
    }
    return Rejection;
})();

var Status;
(function (Status) {
    Status[Status["Unfullfilled"] = 0] = "Unfullfilled";
    Status[Status["Resolved"] = 1] = "Resolved";
    Status[Status["Rejected"] = 2] = "Rejected";
})(Status || (Status = {}));

var Promise = (function () {
    function Promise() {
    }
    return Promise;
})();

var Deferred = (function () {
    function Deferred() {
        this._promise = new Promise(this);
    }
    Deferred.prototype.promise = function () {
        return this._promise;
    };
    return Deferred;
})();
//# sourceMappingURL=promise.js.map
