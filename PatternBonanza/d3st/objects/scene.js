var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var Scene = (function (_super) {
            __extends(Scene, _super);
            function Scene(scene) {
                _super.call(this, scene);
            }
            Object.defineProperty(Scene.prototype, "object", {
                get: function () {
                    return this.baseObject;
                },
                enumerable: true,
                configurable: true
            });
            return Scene;
        })(D3ST.Objects.Object3D);
        Objects.Scene = Scene;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=scene.js.map
