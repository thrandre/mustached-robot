var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var WebGlRenderer = (function (_super) {
            __extends(WebGlRenderer, _super);
            function WebGlRenderer(renderer) {
                _super.call(this, renderer);
            }
            Object.defineProperty(WebGlRenderer.prototype, "object", {
                get: function () {
                    return this.renderer;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(WebGlRenderer.prototype, "domElement", {
                get: function () {
                    return this.object.domElement;
                },
                enumerable: true,
                configurable: true
            });

            WebGlRenderer.prototype.setSize = function (width, height) {
                this.object.setSize(width, height);
            };

            WebGlRenderer.prototype.render = function (scene, camera) {
                this.object.render(scene.object, camera.object);
            };
            return WebGlRenderer;
        })(D3ST.Objects.Renderer);
        Objects.WebGlRenderer = WebGlRenderer;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=webGlRenderer.js.map
