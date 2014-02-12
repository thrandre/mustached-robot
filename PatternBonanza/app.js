/// <reference path="common.ts"/>

;

var IterationResult = (function () {
    function IterationResult(result, shouldBreak) {
        this.result = result;
        this.shouldBreak = shouldBreak;
    }
    return IterationResult;
})();

var FilterAggregator = (function () {
    function FilterAggregator() {
    }
    FilterAggregator.prototype.aggregate = function (item) {
        this.storage.push(item);
    };

    FilterAggregator.prototype.aggregationResult = function () {
        return new EnumerableArray(this.storage);
    };
    return FilterAggregator;
})();

var Aggregator = (function () {
    function Aggregator(aggregatorKernel) {
        this.aggregatorKernel = aggregatorKernel;
        this.storage = [];
    }
    Aggregator.prototype.aggregate = function (item) {
        this.aggregatorKernel(this.storage, item);
    };

    Aggregator.prototype.aggregationResult = function () {
        return new EnumerableArray(this.storage);
    };
    return Aggregator;
})();

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

    EnumerableArray.prototype.iterate = function (iterator) {
        return this.doIterate(iterator, function (agg, next) {
            return agg.push(next);
        });
    };

    EnumerableArray.prototype.aggregateIterate = function (aggregator) {
        var getDefaultValueForType = function (value) {
            if (typeof value === "number") {
                return 0;
            }
            return "";
        };

        var test = this.doIterate(function (item) {
            return new IterationResult(item, false);
        }, function (agg, next) {
            if (typeof agg[0] === "undefined") {
                agg[0] = getDefaultValueForType(next);
            }

            agg[0] = aggregator(agg[0], next);
        });
        console.log(test);
        return test.first();
    };

    EnumerableArray.prototype.doIterate = function (iterator, aggregator) {
        var currentItem;
        var enumerator = this.getEnumerator();

        var resultAggregator = new Aggregator(aggregator);

        while ((currentItem = enumerator.next()) !== null) {
            var iteration = iterator(currentItem);

            if (iteration.result !== null) {
                resultAggregator.aggregate(iteration.result);
            }

            if (iteration.shouldBreak) {
                break;
            }
        }

        return resultAggregator.aggregationResult();
    };

    EnumerableArray.prototype.getItem = function (index) {
        return this.storage[index];
    };

    EnumerableArray.prototype.count = function (predicate) {
        if (!predicate) {
            return this.storage.length;
        }

        return this.where(predicate).count();
    };

    EnumerableArray.prototype.where = function (predicate) {
        return this.iterate(function (item) {
            if (predicate(item)) {
                return new IterationResult(item, false);
            } else {
                return new IterationResult(null, false);
            }
        });
    };

    EnumerableArray.prototype.first = function (predicate) {
        if (!predicate) {
            return this.getItem(0);
        }

        var result = this.iterate(function (item) {
            if (predicate(item)) {
                return new IterationResult(item, true);
            } else {
                return new IterationResult(null, false);
            }
        });

        if (result.count() > 0) {
            return this.getItem(0);
        } else {
            throw new Error("No items in sequence.");
        }
    };

    EnumerableArray.prototype.each = function (action) {
        this.iterate(function (item) {
            action(item);
            return new IterationResult(null, false);
        });
    };

    EnumerableArray.prototype.select = function (selector) {
        return this.iterate(function (item) {
            var select = selector(item);
            return new IterationResult(select, false);
        });
    };

    EnumerableArray.prototype.aggregate = function (aggFunc) {
        return this.aggregateIterate(aggFunc);
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
/// <reference path="linq.ts"/>

var Greeter = (function () {
    function Greeter(medium) {
        this.medium = medium;
    }
    Greeter.prototype.greet = function (name) {
        this.medium.write("Hello " + name);
    };
    return Greeter;
})();

var ConsoleGreeter = (function () {
    function ConsoleGreeter() {
    }
    ConsoleGreeter.prototype.write = function (greeting) {
        console.log(greeting);
    };
    return ConsoleGreeter;
})();

var TestClass = (function () {
    function TestClass(name, age) {
        this.name = name;
        this.age = age;
    }
    return TestClass;
})();

console.log(new EnumerableArray([new TestClass("Caroline", 24), new TestClass("Thomas", 26)]).where(function (p) {
    return p.age > 25;
}).each(function (p) {
    return console.log(p);
}));
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
