/// <reference path="common.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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

        (function (SortOrder) {
            SortOrder[SortOrder["Ascending"] = 0] = "Ascending";
            SortOrder[SortOrder["Descending"] = 1] = "Descending";
        })(Core.SortOrder || (Core.SortOrder = {}));
        var SortOrder = Core.SortOrder;

        var IterationResult = (function () {
            function IterationResult(result, shouldBreak) {
                this.result = result;
                this.shouldBreak = shouldBreak;
            }
            return IterationResult;
        })();
        Core.IterationResult = IterationResult;

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
            function AggregationAggregator(selector, aggregatorFunction) {
                this.selector = selector;
                this.aggregatorFunction = aggregatorFunction;
            }
            AggregationAggregator.prototype.aggregate = function (item) {
                this.storage = this.aggregatorFunction(this.storage, this.selector(item));
            };

            AggregationAggregator.prototype.getResult = function () {
                return this.storage;
            };
            return AggregationAggregator;
        })();

        var GroupingAggregator = (function () {
            function GroupingAggregator(selector) {
                this.selector = selector;
                this.storage = [];
            }
            GroupingAggregator.prototype.bucket = function (item) {
                var key = this.selector(item);
                var bucket = new Enumerable(this.storage).firstOrDefault(function (b) {
                    return b.key === key;
                });

                if (bucket === null || typeof bucket === "undefined") {
                    bucket = new Grouping(key);
                    this.storage.push(bucket);
                }

                bucket.add(item);
            };

            GroupingAggregator.prototype.aggregate = function (item) {
                this.bucket(item);
            };

            GroupingAggregator.prototype.getResult = function () {
                return new Enumerable(this.storage);
            };
            return GroupingAggregator;
        })();

        var SortingAggregator = (function () {
            function SortingAggregator(selector, sortOrder) {
                this.selector = selector;
                this.sortOrder = sortOrder;
                this.storage = [];
            }
            SortingAggregator.prototype.getComparer = function () {
                return this.sortOrder === 0 /* Ascending */ ? function (i1, i2) {
                    return i1 > i2;
                } : function (i1, i2) {
                    return i2 > i1;
                };
            };

            SortingAggregator.prototype.getInsertionPosition = function (item1) {
                var _this = this;
                var comparer = this.getComparer();
                var pos = 0;

                new Enumerable(this.storage).firstOrDefault(function (item2) {
                    if (comparer(_this.selector(item1), _this.selector(item2))) {
                        pos++;
                        return false;
                    }
                    return true;
                });

                return pos;
            };

            SortingAggregator.prototype.aggregate = function (item) {
                this.storage.splice(this.getInsertionPosition(item), 0, item);
            };

            SortingAggregator.prototype.getResult = function () {
                return new Enumerable(this.storage);
            };
            return SortingAggregator;
        })();

        var Iterator = (function () {
            function Iterator(enumerator) {
                this.enumerator = enumerator;
            }
            Iterator.prototype.iterate = function (iterator, aggregator) {
                var i = 0;
                var currentItem;

                while ((currentItem = this.enumerator.next()) !== null) {
                    var iteration = iterator(currentItem, i);

                    if (iteration.result !== null) {
                        aggregator.aggregate(iteration.result);
                    }

                    if (iteration.shouldBreak) {
                        break;
                    }

                    i++;
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
                this.storage = arr ? arr : new Array();
            }
            Enumerable.prototype.getEnumerator = function () {
                var _this = this;
                return new ArrayEnumerator(function (i) {
                    return _this.storage[i];
                });
            };

            Enumerable.prototype.aggregate = function (selector, aggFunc) {
                return new Iterator(this.getEnumerator()).aggregate(function (i) {
                    return new IterationResult(i, false);
                }, new AggregationAggregator(selector, aggFunc));
            };

            Enumerable.prototype.iterate = function (iterator, aggregator) {
                return new Iterator(this.getEnumerator()).filter(iterator, aggregator);
            };

            Enumerable.prototype.group = function (iterator, aggregator) {
                return new Iterator(this.getEnumerator()).filter(iterator, aggregator);
            };

            Enumerable.prototype.filter = function (iterator) {
                return this.iterate(iterator, new FilterAggregator());
            };

            Enumerable.prototype.sort = function (selector, order) {
                return this.iterate(function (i) {
                    return new IterationResult(i, false);
                }, new SortingAggregator(selector, order));
            };

            Enumerable.prototype.groupBy = function (selector) {
                return this.group(function (i) {
                    return new IterationResult(i, false);
                }, new GroupingAggregator(selector));
            };

            Enumerable.prototype.item = function (index) {
                return this.storage[index];
            };

            Enumerable.prototype.count = function (predicate) {
                return predicate ? this.where(predicate).count() : this.storage.length;
            };

            Enumerable.prototype.where = function (predicate) {
                return this.filter(function (item) {
                    if (predicate(item)) {
                        return new IterationResult(item, false);
                    }
                    return new IterationResult(null, false);
                });
            };

            Enumerable.prototype.firstOrDefault = function (predicate) {
                if (!predicate) {
                    return this.item(0);
                }

                var result = this.filter(function (item, i) {
                    if (predicate(item, i)) {
                        return new IterationResult(item, true);
                    }
                    return new IterationResult(null, false);
                });

                return result.count() > 0 ? result.firstOrDefault() : null;
            };

            Enumerable.prototype.select = function (selector) {
                return this.filter(function (item) {
                    return new IterationResult(selector(item), false);
                });
            };

            Enumerable.prototype.orderByAscending = function (selector) {
                return this.sort(selector, 0 /* Ascending */);
            };

            Enumerable.prototype.orderByDescending = function (selector) {
                return this.sort(selector, 1 /* Descending */);
            };

            Enumerable.prototype.aggr = function (selector, aggFunc) {
                return this.aggregate(selector, function (sum, next) {
                    if (typeof sum === "undefined") {
                        return next;
                    } else {
                        return aggFunc(sum, next);
                    }
                });
            };

            Enumerable.prototype.sum = function (selector) {
                return this.aggr(selector, function (sum, next) {
                    return sum + next;
                });
            };

            Enumerable.prototype.toArray = function () {
                return this.storage.slice(0);
            };

            Enumerable.prototype.toList = function () {
                return new List(this.toArray());
            };
            return Enumerable;
        })();
        Core.Enumerable = Enumerable;

        var List = (function (_super) {
            __extends(List, _super);
            function List() {
                _super.apply(this, arguments);
            }
            List.prototype.add = function (item) {
                this.storage.push(item);
            };

            List.prototype.remove = function (index) {
                this.storage.splice(index, 1);
            };

            List.prototype.each = function (action) {
                this.filter(function (item) {
                    action(item);
                    return new Linq.Core.IterationResult(null, false);
                });
            };
            return List;
        })(Linq.Core.Enumerable);
        Core.List = List;

        var Grouping = (function (_super) {
            __extends(Grouping, _super);
            function Grouping(key) {
                _super.call(this);
                this.key = key;
            }
            return Grouping;
        })(List);
        Core.Grouping = Grouping;

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

var Person = (function () {
    function Person(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    return Person;
})();

var p = [
    new Person("Caroline", 24, "female"),
    new Person("Thomas", 26, "male"),
    new Person("Lasse", 21, "male")
];

var l = Enumerable.fromArray(p).groupBy(function (p) {
    return p.age > 25;
}).select(function (g) {
    return g.sum(function (a) {
        return a.age;
    });
});

console.log(l);
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
