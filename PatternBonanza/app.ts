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

console.log("WORKS!");

class IIGreeter extends IoC.InterfaceTypeEnforcer<IGreeter> implements IoC.Interface {
    public interfaceName = "IGreeter";
}

//class DeferredFactory implements IoC.IDeferredFactory {
//    create<T>(): IoC.IDeferred<T> {
//        var d = new Deferred.Deferred<T>();
//        return {
//            promise: d.promise(),
//            resolve: d.resolve(),
//            reject: d.reject()
//        };
//    }
//}
//
//class ModuleLoader implements  IoC.IModuleLoader {
//    load(deps: string[], callback: any): void {
//        require(deps, callback);
//    }
//}
//
//IoC.setup({
//    moduleLoader: new ModuleLoader(),
//    deferredFactory: new DeferredFactory()
//});
//
//IoC.resolve(new IIGreeter(), (greeter) => greeter.greet("Thomas"));