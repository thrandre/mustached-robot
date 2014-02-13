/// <reference path="common.ts"/>
var Enumerable = (function () {
    function Enumerable() {
    }
    Enumerable.fromArray = function (arr) {
        return new Linq.Core.Enumerable(arr);
    };

    Enumerable.fromObject = function (obj) {
        var pairs = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                pairs.push(new Linq.Core.KeyValuePair(key, obj[key]));
            }
        }
        return new Linq.Core.Enumerable(pairs);
    };
    return Enumerable;
})();

var Linq;
(function (Linq) {
    (function (Core) {
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
                this.storage = [];
            }
            FilterAggregator.prototype.aggregate = function (item) {
                this.storage.push(item);
            };

            FilterAggregator.prototype.getResult = function () {
                return new Enumerable(this.storage);
            };
            return FilterAggregator;
        })();

        var AggregationAggregator = (function () {
            function AggregationAggregator() {
            }
            AggregationAggregator.prototype.aggregate = function (item) {
            };

            AggregationAggregator.prototype.getResult = function () {
                return null;
            };
            return AggregationAggregator;
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
                return new Enumerable(this.storage);
            };
            return Aggregator;
        })();

        var Iterator = (function () {
            function Iterator(enumerator) {
                this.enumerator = enumerator;
            }
            Iterator.prototype.iterate = function (iterator, aggregator) {
                var currentItem;

                while ((currentItem = this.enumerator.next()) !== null) {
                    var iteration = iterator(currentItem);

                    if (iteration.result !== null) {
                        aggregator.aggregate(iteration.result);
                    }

                    if (iteration.shouldBreak) {
                        break;
                    }
                }

                return aggregator.getResult();
            };

            Iterator.prototype.filter = function (iterator, aggregator) {
                return this.iterate(iterator, aggregator);
            };

            Iterator.prototype.aggregate = function (iterator, aggregator) {
                return this.iterate(iterator, aggregator);
            };
            return Iterator;
        })();

        var Enumerable = (function () {
            function Enumerable(arr) {
                if (arr) {
                    this.storage = arr;
                } else {
                    this.storage = new Array();
                }
            }
            Enumerable.prototype.getEnumerator = function () {
                var _this = this;
                return new ArrayEnumerator(function (i) {
                    return _this.storage[i];
                });
            };

            Enumerable.prototype.filter = function (iterator) {
                return new Iterator(this.getEnumerator()).filter(iterator, new FilterAggregator());
            };

            Enumerable.prototype.aggregateFilter = function (aggregator) {
                return new Iterator(this.getEnumerator()).aggregate(function (i) {
                    return new IterationResult(i, false);
                }, aggregator);
            };

            Enumerable.prototype.item = function (index) {
                return this.storage[index];
            };

            Enumerable.prototype.count = function (predicate) {
                if (!predicate) {
                    return this.storage.length;
                }

                return this.where(predicate).count();
            };

            Enumerable.prototype.where = function (predicate) {
                return this.filter(function (item) {
                    if (predicate(item)) {
                        return new IterationResult(item, false);
                    } else {
                        return new IterationResult(null, false);
                    }
                });
            };

            Enumerable.prototype.firstOrDefault = function (predicate) {
                if (!predicate) {
                    return this.item(0);
                }

                var result = this.filter(function (item) {
                    if (predicate(item)) {
                        return new IterationResult(item, true);
                    } else {
                        return new IterationResult(null, false);
                    }
                });

                if (result.count() > 0) {
                    return result.firstOrDefault();
                } else {
                    return null;
                }
            };

            Enumerable.prototype.each = function (action) {
                this.filter(function (item) {
                    action(item);
                    return new IterationResult(null, false);
                });
            };

            Enumerable.prototype.select = function (selector) {
                return this.filter(function (item) {
                    return new IterationResult(selector(item), false);
                });
            };

            Enumerable.prototype.aggregate = function (aggFunc) {
                return null;
            };
            return Enumerable;
        })();
        Core.Enumerable = Enumerable;

        var KeyValuePair = (function () {
            function KeyValuePair(key, value) {
                this.key = key;
                this.value = value;
            }
            return KeyValuePair;
        })();
        Core.KeyValuePair = KeyValuePair;

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
    })(Linq.Core || (Linq.Core = {}));
    var Core = Linq.Core;
})(Linq || (Linq = {}));
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

Enumerable.fromObject({ "test": 42 }).where(function (kvp) {
    return kvp.value === 42;
}).each(function (v) {
    return console.log(v);
});
