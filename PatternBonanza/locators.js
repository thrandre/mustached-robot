var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "ioc/ioc"], function(require, exports, IoC) {
    var IIEnumerableFactory = (function (_super) {
        __extends(IIEnumerableFactory, _super);
        function IIEnumerableFactory() {
            _super.apply(this, arguments);
            this.interfaceName = "IEnumerableFactory";
        }
        return IIEnumerableFactory;
    })(IoC.IInterface);
    exports.IIEnumerableFactory = IIEnumerableFactory;
});
//# sourceMappingURL=locators.js.map
