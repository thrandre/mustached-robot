import IoC = require("ioc");

interface IMedium { 
	write(greeting: string): void;
}

interface IGreeter {
	greet(name: string);
}

class Greeter implements IGreeter {
	constructor(public medium: IMedium) {}
	public greet(name: string): void {
		this.medium.write("Hello " + name);
	}
}

class ConsoleGreeter implements IMedium {
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

//var l = Enumerable
//    .fromArray(p)
//    .groupBy(p=> p.age > 25)
//    .select(g=> g.sum(a => a.age));

//console.log(l);

console.log("WORKS!");

interface IIInterface {
    interfaceName: string;
}

class IIGreeter extends IoC.IInterface<IGreeter> implements IIInterface {
    public interfaceName = "IGreeter";
}

var r = IoC.resolve(new IIGreeter(), () => null);
r.greet("Thomas");