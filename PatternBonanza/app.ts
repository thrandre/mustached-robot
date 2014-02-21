/// <reference path="deferred/deferred.d.ts"/>

import Deferred = require("deferred/deferred");
import IoC = require("ioc/ioc");

export interface IMedium { 
	write(greeting: string): void;
}

export interface IGreeter {
	greet(name: string);
}

export class Greeter implements IGreeter {
	constructor(public medium: IMedium) {}
    private counter = 0;
    public greet(name: string): void {
        this.counter++;
        this.medium.write("Hello " + name);
        this.medium.write("For the " + this.counter + " time!");
    }
}

export class ConsoleGreeter implements IMedium {
	public write(greeting: string): void {
		console.log(greeting);
	}
}

class Person {
    constructor(public name: string, public age: number, public gender: string) {}
}

var p = [
    new Person("Caroline", 24, "female"),
    new Person("Thomas", 26, "male"),
    new Person("Lasse", 21, "male")
];

class IIGreeter extends IoC.IInterface<IGreeter> {
    public interfaceName = "IGreeter";
}

IoC.setup({ deferredFactory: new Deferred.DeferredFactory() });

IoC.autoResolve(window["dependencies"]);

IoC.resolve(new IIGreeter()).then(g=> {
    g.greet("Thomas");
    IoC.resolve(new IIGreeter()).then(g=> {
        g.greet("Thomas");
        IoC.resolve(new IIGreeter()).then(g=> {
            g.greet("Thomas");

        });
    });
});