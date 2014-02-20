/// <reference path="deferred/deferred.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "deferred/deferred", "ioc"], function(require, exports, D, IoC) {
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

    var IIDeferredFactory = (function (_super) {
        __extends(IIDeferredFactory, _super);
        function IIDeferredFactory() {
            _super.apply(this, arguments);
            this.interfaceName = "IDeferredFactory";
        }
        return IIDeferredFactory;
    })(IoC.IInterface);

    IoC.autoResolve(window["dependencies"]);

    var greeter = IoC.resolve(new IIGreeter());
    var factory = IoC.resolve(new IIDeferredFactory());

    D.when(greeter, factory).then(function (instances) {
        var g = instances[0];
        var f = instances[1];

        g.greet("Thomas");
        console.log(f);
    });
});
//# sourceMappingURL=app.js.map
