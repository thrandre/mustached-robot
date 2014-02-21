/// <reference path="deferred/deferred.d.ts"/>

import Deferred = require("deferred/deferred");
import IoC = require("ioc/ioc");
import Locators = require("locators");

class Person {
    constructor(public name: string, public age: number, public gender: string) {}
}

IoC.setup({ deferredFactory: new Deferred.DeferredFactory() });
IoC.autoResolve(window["dependencies"]);

IoC.resolve(new Locators.IIEnumerableFactory()).then(enumerableFactory => {
    var people = [
        new Person("Caroline", 24, "female"),
        new Person("Thomas", 26, "male"),
        new Person("Lasse", 21, "male")
    ];

    enumerableFactory
        .fromArray(people)
        .groupBy(p=> p.age > 25)
        .orderByAscending(g => g.sum(p => p.age))
        .toList()
        .each(g => console.log(g));
});