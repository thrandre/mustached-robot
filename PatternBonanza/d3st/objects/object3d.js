var D3ST;
(function (D3ST) {
    (function (Objects) {
        var Object3D = (function () {
            function Object3D(baseObject) {
                this.baseObject = baseObject;
                this.initObservers();
            }
            Object.defineProperty(Object3D.prototype, "object", {
                get: function () {
                    return this.baseObject;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Object3D.prototype, "position", {
                get: function () {
                    return this._position;
                },
                set: function (position) {
                    this._position.setFrom(position);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "rotation", {
                get: function () {
                    return this._rotation;
                },
                set: function (rotation) {
                    this._rotation.setFrom(rotation);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "scale", {
                get: function () {
                    return this._scale;
                },
                set: function (scale) {
                    this._scale.setFrom(scale);
                },
                enumerable: true,
                configurable: true
            });


            Object3D.prototype.addChild = function (child) {
                this.object.add(child.object);
            };

            Object3D.prototype.initObservers = function () {
            };
            return Object3D;
        })();
        Objects.Object3D = Object3D;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=object3d.js.map
