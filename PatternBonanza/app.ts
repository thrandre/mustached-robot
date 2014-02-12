/// <reference path="ioc.ts" />

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

IoC.autoResolve(window["dependencies"]);