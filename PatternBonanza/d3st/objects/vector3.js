var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var Vector3 = (function (_super) {
            __extends(Vector3, _super);
            function Vector3(_wrapped) {
                _super.call(this);
                this._wrapped = _wrapped;
            }
            Object.defineProperty(Vector3.prototype, "x", {
                get: function () {
                    return this._wrapped.x;
                },
                set: function (value) {
                    var _this = this;
                    this._wrapped.x = value;
                    this.notifyObservers(new Observable.PropertyChangedEventArgs(new Observable.PropertyInfo(function () {
                        return _this.x;
                    })));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vector3.prototype, "y", {
                get: function () {
                    return this._wrapped.y;
                },
                set: function (value) {
                    var _this = this;
                    this._wrapped.y = value;
                    this.notifyObservers(new Observable.PropertyChangedEventArgs(new Observable.PropertyInfo(function () {
                        return _this.y;
                    })));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vector3.prototype, "z", {
                get: function () {
                    return this._wrapped.z;
                },
                set: function (value) {
                    var _this = this;
                    this._wrapped.z = value;
                    this.notifyObservers(new Observable.PropertyChangedEventArgs(new Observable.PropertyInfo(function () {
                        return _this.y;
                    })));
                },
                enumerable: true,
                configurable: true
            });

            Vector3.prototype.setFrom = function (vector) {
                this.x = vector.x;
                this.y = vector.y;
                this.z = vector.z;
            };

            Vector3.prototype.asThreeVector = function () {
                return this._wrapped;
            };
            return Vector3;
        })(Observable.Observable);
        Objects.Vector3 = Vector3;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=vector3.js.map
