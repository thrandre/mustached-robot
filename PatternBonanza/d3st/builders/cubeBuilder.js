var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var D3ST;
(function (D3ST) {
    (function (Builders) {
        var CubeBuilder = (function (_super) {
            __extends(CubeBuilder, _super);
            function CubeBuilder() {
                _super.apply(this, arguments);
                this._size = { width: 1, height: 1, depth: 1 };
                this._subdivisions = { x: 1, y: 1, z: 1 };
            }
            CubeBuilder.prototype.withSize = function (size) {
                this._size = size;
                return this;
            };

            CubeBuilder.prototype.withSubdivision = function (subdivisions) {
                this._subdivisions = subdivisions;
                return this;
            };

            CubeBuilder.prototype.withMaterial = function (materialBuilder) {
                return _super.prototype.withMaterial.call(this, materialBuilder);
            };

            CubeBuilder.prototype.withShadows = function (shadows) {
                return _super.prototype.withShadows.call(this, shadows);
            };

            CubeBuilder.prototype.create = function () {
                return _super.prototype.create.call(this, new THREE.CubeGeometry(this._size.width, this._size.height, this._size.depth, this._subdivisions.x, this._subdivisions.y, this._subdivisions.z));
            };
            return CubeBuilder;
        })(D3ST.Builders.MeshBuilder);
        Builders.CubeBuilder = CubeBuilder;
    })(D3ST.Builders || (D3ST.Builders = {}));
    var Builders = D3ST.Builders;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=cubeBuilder.js.map
