var Rejection = (function () {
    function Rejection() {
    }
    return Rejection;
})();

var Status;
(function (Status) {
    Status[Status["Unfulfilled"] = 0] = "Unfulfilled";
    Status[Status["Resolved"] = 1] = "Resolved";
    Status[Status["Rejected"] = 2] = "Rejected";
})(Status || (Status = {}));

var Promise = (function () {
    function Promise(deferred) {
        this._deferred = deferred;
    }
    Object.defineProperty(Promise.prototype, "status", {
        get: function () {
            return this._deferred.status;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Promise.prototype, "result", {
        get: function () {
            return this._deferred.result;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Promise.prototype, "error", {
        get: function () {
            return this._deferred.error;
        },
        enumerable: true,
        configurable: true
    });

    Promise.prototype.done = function (cb) {
        this._deferred.done(cb);
        return this;
    };

    Promise.prototype.fail = function (cb) {
        this._deferred.fail(cb);
        return this;
    };

    Promise.prototype.thenz = function () {
        return null;
    };
    return Promise;
})();

var Deferred = (function () {
    function Deferred() {
        this._status = 0 /* Unfulfilled */;
        this._resolved = function (_) {
        };
        this._rejected = function (_) {
        };
        this._promise = new Promise(this);
    }
    Deferred.prototype.promise = function () {
        return this._promise;
    };

    Object.defineProperty(Deferred.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Deferred.prototype, "result", {
        get: function () {
            if (this.status !== 1 /* Resolved */) {
                throw new Error("No value present.");
            }
            return this._result;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Deferred.prototype, "error", {
        get: function () {
            if (this.status !== 2 /* Rejected */) {
                throw new Error("No error.");
            }
            return this._error;
        },
        enumerable: true,
        configurable: true
    });

    Deferred.prototype.done = function (cb) {
        if (this.status === 1 /* Resolved */) {
            cb(this.result);
            return this;
        }

        if (this.status !== 0 /* Unfulfilled */) {
            return this;
        }

        var prev = this._resolved;
        this._resolved = function (v) {
            prev(v);
            cb(v);
        };

        return this;
    };

    Deferred.prototype.fail = function (cb) {
        if (this.status === 2 /* Rejected */) {
            cb(this.error);
            return this;
        }

        if (this.status !== 0 /* Unfulfilled */) {
            return this;
        }

        var prev = this._rejected;
        this._rejected = function (v) {
            prev(v);
            cb(v);
        };

        return this;
    };

    Deferred.prototype.then = function (cb) {
        var d = new Deferred();

        this.done(function (v) {
            var promiseOrValue = cb(v);
            if (promiseOrValue instanceof Promise) {
                var promise = promiseOrValue;
                promise.done(function (v2) {
                    return d.resolve(v2);
                }).fail(function (err) {
                    return d.reject(err);
                });
                return promise;
            }

            d.resolve(promiseOrValue);
        }).fail(function (err) {
            return d.reject(err);
        });

        return d.promise();
    };

    Deferred.prototype.resolve = function (result) {
        if (this.status !== 0 /* Unfulfilled */) {
            throw new Error("Tried to resolve a fulfilled promise");
        }

        this._result = result;
        this._status = 1 /* Resolved */;
        this._resolved(result);

        this.detach();
        return this;
    };

    Deferred.prototype.reject = function (err) {
        if (this.status !== 0 /* Unfulfilled */) {
            throw new Error("Tried to reject a fulfilled promise");
        }

        this._error = err;
        this._status = 2 /* Rejected */;
        this._rejected(err);

        this.detach();
        return this;
    };

    Deferred.prototype.detach = function () {
        this._resolved = function (_) {
        };
        this._rejected = function (_) {
        };
    };
    return Deferred;
})();
//# sourceMappingURL=deferred.js.map
