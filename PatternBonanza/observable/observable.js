define(["require", "exports"], function(require, exports) {
    var PropertyInfo = (function () {
        function PropertyInfo(root) {
            this.root = root;
            this._steps = [];
        }
        Object.defineProperty(PropertyInfo.prototype, "value", {
            get: function () {
                var accessor = this.root;
                for (var i in this._steps)
                    accessor = accessor[this._steps[i]];

                return accessor;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PropertyInfo.prototype, "path", {
            get: function () {
                return this._steps.join(".");
            },
            enumerable: true,
            configurable: true
        });

        PropertyInfo.prototype.getLastTraversalStep = function (property) {
            var segments = property.toString().replace(/\n|\r|\t|\s{2,}/g, "").match(/function \(\) \{return _this\.(.*?);}/)[1].split(".");

            return segments[segments.length - 1];
        };

        PropertyInfo.prototype.pathSegment = function (i) {
            return this._steps[i];
        };

        PropertyInfo.prototype.addStep = function (property) {
            this._steps.push(this.getLastTraversalStep(property));
            return this;
        };

        PropertyInfo.prototype.combine = function (parts) {
            for (var i in parts)
                this._steps.push(parts[i].path);

            return this;
        };
        return PropertyInfo;
    })();
    exports.PropertyInfo = PropertyInfo;

    var Observable = (function () {
        function Observable() {
            this._observerContainer = new ObserverContainer();
        }
        Observable.prototype.notifyObservers = function (property, nestedProperties) {
            nestedProperties = nestedProperties || [];
            this._observerContainer.notify(this, new PropertyInfo(this).addStep(property).combine(nestedProperties));
        };

        Observable.prototype.observe = function (observer) {
            this._observerContainer.add(observer);
            return this;
        };
        return Observable;
    })();
    exports.Observable = Observable;

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

        ObserverContainer.prototype.notify = function (observable, property) {
            for (var i in this._observers)
                this._observers[i](observable, property);
        };
        return ObserverContainer;
    })();
});
//# sourceMappingURL=observable.js.map
