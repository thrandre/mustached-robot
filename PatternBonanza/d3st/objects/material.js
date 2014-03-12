var D3ST;
(function (D3ST) {
    (function (Objects) {
        var Material = (function () {
            function Material(material) {
                this.material = material;
            }
            Object.defineProperty(Material.prototype, "object", {
                get: function () {
                    return this.material;
                },
                enumerable: true,
                configurable: true
            });
            return Material;
        })();
        Objects.Material = Material;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=material.js.map
