var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var D3ST;
(function (D3ST) {
    (function (Builders) {
        var LambertMaterialBuilder = (function (_super) {
            __extends(LambertMaterialBuilder, _super);
            function LambertMaterialBuilder() {
                _super.apply(this, arguments);
            }
            LambertMaterialBuilder.prototype.create = function () {
                return new D3ST.Objects.Material(new THREE.MeshLambertMaterial({
                    opacity: this.opacity,
                    transparent: this.transparent,
                    color: this.color
                }));
            };
            return LambertMaterialBuilder;
        })(D3ST.Builders.MaterialBuilder);
        Builders.LambertMaterialBuilder = LambertMaterialBuilder;
    })(D3ST.Builders || (D3ST.Builders = {}));
    var Builders = D3ST.Builders;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=lambertMaterialBuilder.js.map
