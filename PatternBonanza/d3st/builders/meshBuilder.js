var D3ST;
(function (D3ST) {
    (function (Builders) {
        var MeshBuilder = (function () {
            function MeshBuilder() {
                this._shadow = true;
            }
            MeshBuilder.prototype.withMaterial = function (materialBuilder) {
                this._materialBuilder = materialBuilder;
                return this;
            };

            MeshBuilder.prototype.withShadows = function (shadows) {
                this._shadow = shadows;
                return this;
            };

            MeshBuilder.prototype.create = function (geometry) {
                var o = new D3ST.Objects.Object3D(new THREE.Mesh(geometry, this._materialBuilder.create()));

                o.object.castShadow = this._shadow;
                o.object.receiveShadow = this._shadow;

                return o;
            };
            return MeshBuilder;
        })();
        Builders.MeshBuilder = MeshBuilder;
    })(D3ST.Builders || (D3ST.Builders = {}));
    var Builders = D3ST.Builders;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=meshBuilder.js.map
