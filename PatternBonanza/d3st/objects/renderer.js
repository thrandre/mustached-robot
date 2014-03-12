var D3ST;
(function (D3ST) {
    (function (Objects) {
        var Renderer = (function () {
            function Renderer(renderer) {
                this.renderer = renderer;
            }
            Object.defineProperty(Renderer.prototype, "object", {
                get: function () {
                    return this.renderer;
                },
                enumerable: true,
                configurable: true
            });

            Renderer.prototype.render = function (scene, camera) {
            };
            return Renderer;
        })();
        Objects.Renderer = Renderer;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=renderer.js.map
