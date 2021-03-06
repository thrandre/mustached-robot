var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var IoC = require("ioc/ioc");

var IIEnumerableFactory = (function (_super) {
    __extends(IIEnumerableFactory, _super);
    function IIEnumerableFactory() {
        _super.apply(this, arguments);
        this.interfaceName = "IEnumerableFactory";
        this.methods = [];
        this.properties = [];
    }
    return IIEnumerableFactory;
})(IoC.IInterface);
exports.IIEnumerableFactory = IIEnumerableFactory;
//# sourceMappingURL=locators.js.map
