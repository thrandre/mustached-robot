/// <reference path="linq.ts"/>

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

class TestClass {
    constructor(public name: string, public age: number) {}
}

console.log(new EnumerableArray([new TestClass("Caroline", 24), new TestClass("Thomas", 26)]).where(p=> p.age > 25).each(p => console.log(p)));