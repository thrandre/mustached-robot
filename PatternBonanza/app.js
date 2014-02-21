/// <reference path="deferred/deferred.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "deferred/deferred", "ioc/ioc"], function(require, exports, Deferred, IoC) {
    var Greeter = (function () {
        function Greeter(medium) {
            this.medium = medium;
        }
        Greeter.prototype.greet = function (name) {
            this.medium.write("Hello " + name);
        };
        return Greeter;
    })();
    exports.Greeter = Greeter;

    var ConsoleGreeter = (function () {
        function ConsoleGreeter() {
        }
        ConsoleGreeter.prototype.write = function (greeting) {
            console.log(greeting);
        };
        return ConsoleGreeter;
    })();
    exports.ConsoleGreeter = ConsoleGreeter;

    var Person = (function () {
        function Person(name, age, gender) {
            this.name = name;
            this.age = age;
            this.gender = gender;
        }
        return Person;
    })();

    var p = [
        new Person("Caroline", 24, "female"),
        new Person("Thomas", 26, "male"),
        new Person("Lasse", 21, "male")
    ];

    var IIGreeter = (function (_super) {
        __extends(IIGreeter, _super);
        function IIGreeter() {
            _super.apply(this, arguments);
            this.interfaceName = "IGreeter";
        }
        return IIGreeter;
    })(IoC.IInterface);

    IoC.setup({ deferredFactory: new Deferred.DeferredFactory() });

    IoC.autoResolve(window["dependencies"]);

    IoC.resolve(new IIGreeter()).then(function (g) {
        return g.greet("Thomas");
    });
});
//# sourceMappingURL=app.js.map
