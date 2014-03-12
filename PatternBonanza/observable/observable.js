var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Observable;
(function (_Observable) {
    var Property = (function () {
        function Property(property, getter) {
            this.property = property;
            this.getter = getter;
        }
        return Property;
    })();
    _Observable.Property = Property;

    (function (Event) {
        Event[Event["PropertyChanged"] = 0] = "PropertyChanged";
        Event[Event["CollectionChanged"] = 1] = "CollectionChanged";
    })(_Observable.Event || (_Observable.Event = {}));
    var Event = _Observable.Event;

    (function (CollectionChangeType) {
        CollectionChangeType[CollectionChangeType["Add"] = 0] = "Add";
        CollectionChangeType[CollectionChangeType["Remove"] = 1] = "Remove";
    })(_Observable.CollectionChangeType || (_Observable.CollectionChangeType = {}));
    var CollectionChangeType = _Observable.CollectionChangeType;

    var PropertyInfo = (function () {
        function PropertyInfo(property) {
            this.segments = [];
            this.segments = this.getPropertySegments(property);
        }
        Object.defineProperty(PropertyInfo.prototype, "path", {
            get: function () {
                return this.segments.join(".");
            },
            enumerable: true,
            configurable: true
        });

        PropertyInfo.prototype.getPropertySegments = function (property) {
            return property.toString().replace(/\n|\r|\t|\s{2,}/g, "").match(/function \(\) \{return _this\.(.*?);}/)[1].split(".");
        };

        PropertyInfo.prototype.getValue = function (target) {
            var accessor = target;
            for (var i in this.segments) {
                accessor = accessor[this.segments[i]];
            }
            return accessor;
        };

        PropertyInfo.prototype.combine = function () {
            var parts = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                parts[_i] = arguments[_i + 0];
            }
            for (var i in parts) {
                this.segments = this.segments.concat(parts[i].segments);
            }
            return this;
        };
        return PropertyInfo;
    })();
    _Observable.PropertyInfo = PropertyInfo;

    var CollectionChangedInfo = (function () {
        function CollectionChangedInfo(type, item) {
            this.type = type;
            this.item = item;
        }
        return CollectionChangedInfo;
    })();
    _Observable.CollectionChangedInfo = CollectionChangedInfo;

    var EventArgs = (function () {
        function EventArgs(event, data) {
            this.event = event;
            this.data = data;
        }
        return EventArgs;
    })();
    _Observable.EventArgs = EventArgs;

    var PropertyChangedEventArgs = (function (_super) {
        __extends(PropertyChangedEventArgs, _super);
        function PropertyChangedEventArgs(data) {
            _super.call(this, 0 /* PropertyChanged */, data);
        }
        return PropertyChangedEventArgs;
    })(EventArgs);
    _Observable.PropertyChangedEventArgs = PropertyChangedEventArgs;

    var CollectionChangedEventArgs = (function (_super) {
        __extends(CollectionChangedEventArgs, _super);
        function CollectionChangedEventArgs(data) {
            _super.call(this, 1 /* CollectionChanged */, data);
        }
        return CollectionChangedEventArgs;
    })(EventArgs);
    _Observable.CollectionChangedEventArgs = CollectionChangedEventArgs;

    var Observable = (function () {
        function Observable() {
            this._observerContainer = new ObserverContainer();
        }
        Observable.prototype.notifyObservers = function (eventArgs) {
            this._observerContainer.notify(this, eventArgs);
        };

        Observable.prototype.observe = function (observer) {
            this._observerContainer.add(observer);
            return this;
        };
        return Observable;
    })();
    _Observable.Observable = Observable;

    var ObserverContainer = (function () {
        function ObserverContainer() {
            this._observers = [];
        }
        ObserverContainer.prototype.add = function (observer) {
            var idx = this._observers.indexOf(observer);
            if (idx < 0)
                this._observers.push(observer);
        };

        ObserverContainer.prototype.remove = function (observer) {
            var idx = this._observers.indexOf(observer);
            if (idx > -1)
                this._observers.splice(idx, 1);
        };

        ObserverContainer.prototype.notify = function (observable, eventArgs) {
            for (var i in this._observers)
                this._observers[i](observable, eventArgs);
        };
        return ObserverContainer;
    })();
})(Observable || (Observable = {}));
//# sourceMappingURL=observable.js.map
