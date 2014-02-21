/// <reference path="deferred/deferred.d.ts"/>
define(["require", "exports", "deferred/deferred", "ioc/ioc", "locators"], function(require, exports, Deferred, IoC, Locators) {
    var Person = (function () {
        function Person(name, age, gender) {
            this.name = name;
            this.age = age;
            this.gender = gender;
        }
        return Person;
    })();

    IoC.setup({ deferredFactory: new Deferred.DeferredFactory() });
    IoC.autoResolve(window["dependencies"]);

    IoC.resolve(new Locators.IIEnumerableFactory()).then(function (enumerableFactory) {
        var people = [
            new Person("Caroline", 24, "female"),
            new Person("Thomas", 26, "male"),
            new Person("Lasse", 21, "male")
        ];

        enumerableFactory.fromArray(people).groupBy(function (p) {
            return p.age > 25;
        }).orderByAscending(function (g) {
            return g.sum(function (p) {
                return p.age;
            });
        }).toList().each(function (g) {
            return console.log(g);
        });
    });
});
//# sourceMappingURL=app.js.map
