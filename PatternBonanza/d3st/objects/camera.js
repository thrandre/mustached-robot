var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var Camera = (function (_super) {
            __extends(Camera, _super);
            function Camera(camera) {
                _super.call(this, camera);
            }
            Object.defineProperty(Camera.prototype, "object", {
                get: function () {
                    return this.baseObject;
                },
                enumerable: true,
                configurable: true
            });
            return Camera;
        })(D3ST.Objects.AnimateableObject);
        Objects.Camera = Camera;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=camera.js.map
