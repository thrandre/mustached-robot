console.log("Test.");
var EnumerableArray = (function () {
    function EnumerableArray(arr) {
        if (arr) {
            this.storage = arr;
        } else {
            this.storage = new Array();
        }
    }
    EnumerableArray.prototype.getEnumerator = function () {
        var _this = this;
        return new ArrayEnumerator(function (i) {
            return _this.storage[i];
        });
    };

    EnumerableArray.prototype.where = function (predicate) {
        var item;
        var enumerator = this.getEnumerator();

        var result = new Array();

        while ((item = enumerator.next()) !== null) {
            if (predicate(item)) {
                result.push(item);
            }
        }

        return null;
    };

    EnumerableArray.prototype.first = function (predicate) {
        var item;
        var enumerator = this.getEnumerator();

        while ((item = enumerator.next()) !== null) {
            if (predicate) {
                if (predicate(item)) {
                    return item;
                }
            } else {
                return item;
            }
        }

        throw new Error("No items in sequence.");
    };
    return EnumerableArray;
})();

var ArrayEnumerator = (function () {
    function ArrayEnumerator(accessor) {
        this.currentIndex = 0;
        this.accessor = accessor;
    }
    Object.defineProperty(ArrayEnumerator.prototype, "current", {
        get: function () {
            return this.accessor(this.currentIndex);
        },
        enumerable: true,
        configurable: true
    });

    ArrayEnumerator.prototype.next = function () {
        var next = this.current;

        if (next) {
            this.currentIndex++;
            return next;
        }

        return null;
    };

    ArrayEnumerator.prototype.reset = function () {
        this.currentIndex = 0;
    };
    return ArrayEnumerator;
})();
Object.prototype.may = function () {
    return new Opt(this);
};

Number.prototype.may = function () {
    return new Opt(this);
};

String.prototype.may = function () {
    return new Opt(this);
};

var Opt = (function () {
    function Opt(value, hasValue) {
        if (typeof hasValue === "undefined") { hasValue = true; }
        this.valueStore = value;
        this.valueSet = hasValue;
    }
    Object.defineProperty(Opt.prototype, "hasValue", {
        get: function () {
            return this.valueSet;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Opt.prototype, "value", {
        get: function () {
            return this.hasValue ? this.valueStore : (this.otherwiseFunc ? this.otherwiseFunc() : this.valueStore);
        },
        set: function (val) {
            this.valueStore = val;
            this.valueSet = true;
        },
        enumerable: true,
        configurable: true
    });


    Opt.prototype.otherwise = function (other) {
        this.otherwiseFunc = other;
        return this;
    };

    Opt.noVal = function () {
        return new Opt(null, false);
    };
    return Opt;
})();
//# sourceMappingURL=app.js.map
