var D3ST;
(function (D3ST) {
    (function (Builders) {
        var CameraBuilder = (function () {
            function CameraBuilder() {
                this._fov = 35;
                this._aspect = 1.6;
                this._near = 0.1;
                this._far = 1000;
            }
            CameraBuilder.prototype.withFieldOfView = function (fov) {
                this._fov = fov;
                return this;
            };

            CameraBuilder.prototype.withAspectRatio = function (aspect) {
                this._aspect = aspect;
                return this;
            };

            CameraBuilder.prototype.withNear = function (near) {
                this._near = near;
                return this;
            };

            CameraBuilder.prototype.withFar = function (far) {
                this._far = far;
                return this;
            };

            CameraBuilder.prototype.create = function () {
                return new D3ST.Objects.Camera(new THREE.PerspectiveCamera(this._fov, this._aspect, this._near, this._far));
            };
            return CameraBuilder;
        })();
        Builders.CameraBuilder = CameraBuilder;
    })(D3ST.Builders || (D3ST.Builders = {}));
    var Builders = D3ST.Builders;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=cameraBuilder.js.map
