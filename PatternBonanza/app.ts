/// <reference path="deferred/deferred.d.ts"/>

import D = require("deferred/deferred");
import IoC = require("ioc/ioc");

export interface IMedium { 
	write(greeting: string): void;
}

export interface IGreeter {
	greet(name: string);
}

export class Greeter implements IGreeter {
	constructor(public medium: IMedium) {}
	public greet(name: string): void {
		this.medium.write("Hello " + name);
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

IoC.autoResolve(window["dependencies"]);

var greeter = IoC.resolve(new IIGreeter());

D.when(greeter).then(instances => {
    var g: IGreeter = instances[0];

    g.greet("Thomas");
});