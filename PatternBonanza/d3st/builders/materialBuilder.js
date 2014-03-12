var D3ST;
(function (D3ST) {
    (function (Builders) {
        var MaterialBuilder = (function () {
            function MaterialBuilder() {
                this.color = 0xffffff;
                this.opacity = 1;
                this.transparent = false;
            }
            MaterialBuilder.prototype.withOpacity = function (opacity) {
                this.opacity = opacity;
                return this;
            };

            MaterialBuilder.prototype.withTransparency = function (transparency) {
                this.transparent = transparency;
                return this;
            };

            MaterialBuilder.prototype.withColor = function (color) {
                this.color = color;
                return this;
            };

            MaterialBuilder.prototype.create = function () {
                throw new Error("Abstract base class. Use concrete implementation.");
            };
            return MaterialBuilder;
        })();
        Builders.MaterialBuilder = MaterialBuilder;
    })(D3ST.Builders || (D3ST.Builders = {}));
    var Builders = D3ST.Builders;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=materialBuilder.js.map
