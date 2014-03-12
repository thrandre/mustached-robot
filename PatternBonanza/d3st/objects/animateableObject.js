var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var AnimateableObject = (function (_super) {
            __extends(AnimateableObject, _super);
            function AnimateableObject(object) {
                _super.call(this, object);
            }
            return AnimateableObject;
        })(D3ST.Objects.Object3D);
        Objects.AnimateableObject = AnimateableObject;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
//# sourceMappingURL=animateableObject.js.map
