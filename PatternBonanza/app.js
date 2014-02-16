var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "ioc"], function(require, exports, IoC) {
    var Greeter = (function () {
        function Greeter(medium) {
            this.medium = medium;
        }
        Greeter.prototype.greet = function (name) {
            this.medium.write("Hello " + name);
        };
        return Greeter;
    })();

    var ConsoleGreeter = (function () {
        function ConsoleGreeter() {
        }
        ConsoleGreeter.prototype.write = function (greeting) {
            console.log(greeting);
        };
        return ConsoleGreeter;
    })();

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

    //var l = Enumerable
    //    .fromArray(p)
    //    .groupBy(p=> p.age > 25)
    //    .select(g=> g.sum(a => a.age));
    //console.log(l);
    console.log("WORKS!");

    var IIGreeter = (function (_super) {
        __extends(IIGreeter, _super);
        function IIGreeter() {
            _super.apply(this, arguments);
            this.interfaceName = "IGreeter";
        }
        return IIGreeter;
    })(IoC.Test);

    var greeter = IoC.resolve(new IIGreeter(), function (i) {
        return console.log(i);
    });
    greeter.greet();
});
//# sourceMappingURL=app.js.map
