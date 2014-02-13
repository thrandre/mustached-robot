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

var l = Enumerable.fromArray([1, 2, 3, 4, 5]).orderByAscending((i1, i2) => {
	if(i1 === i2){
		return 0;
	}
	
	if(i1 > i2) {
		return -1;
	}
	
	return 1;
});

console.log(l);