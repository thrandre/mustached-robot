var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var D3ST;
(function (D3ST) {
    (function (Builders) {
        var BasicMaterialBuilder = (function (_super) {
            __extends(BasicMaterialBuilder, _super);
            function BasicMaterialBuilder() {
                _super.apply(this, arguments);
            }
            BasicMaterialBuilder.prototype.create = function () {
                return new D3ST.Objects.Material(new THREE.MeshBasicMaterial({
                    opacity: this.opacity,
                    transparent: this.transparent,
                    color: this.color
                }));
            };
            return BasicMaterialBuilder;
        })(D3ST.Builders.MaterialBuilder);
        Builders.BasicMaterialBuilder = BasicMaterialBuilder;
    })(D3ST.Builders || (D3ST.Builders = {}));
    var Builders = D3ST.Builders;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=basicMaterialBuilder.js.map
