///<reference path="require.d.ts"/>

export class IInterface<T> {
    enforcer: T;
}

export interface IResolvedCallback<T> {
    (instance: T): void;
}

export function resolve<T>(iinterface: IInterface<T>, resolvedCallback: IResolvedCallback<T>): T {
    return null;
}

function resolveAll<T>(): T[] {
    return null;
}

function register(): void {

}

function autoResolve(descriptorObject: { [id: string]: IInterfaceImplementation[] }): void {
    IoCContainer.current().resolveFromDescriptor(descriptorObject);
}

class Resolver {
    private getClassInstantiator(classReference: string, args: any[]): ()=> any {
        var wrapper = (f, a)=> {
            var params = [f].concat(a);
            return f.bind.apply(f, params);
        };

        return ()=> new (wrapper(eval(classReference), args));
    }

    private getImplementationForInterface(interfaceName: string): IInterfaceImplementation {
        return null;
    }

    private getResolver(interfaceName: string): ()=> any {
        var impl = this.getImplementationForInterface(interfaceName);
        return ()=> {
            var deps = [];
            for (var dep in impl.dependencies) {
                deps.push(this.getResolver(impl.dependencies[dep])());
            }

            return this.getClassInstantiator(impl.classReference, deps)();
        };
    }
}

class IoCContainer {
    static instance: IoCContainer = null;

    static current(): IoCContainer {
        return IoCContainer.instance
            ? IoCContainer.instance
            : (IoCContainer.instance = new IoCContainer());
    }

    private graph: { [id: string]: IInterfaceImplementation[] } = {};

    private addImplementationToGraph(interfaceName: string, implementation: IInterfaceImplementation): void {
        if (!this.graph[interfaceName]) {
            this.graph[interfaceName] = [];
        }
        this.graph[interfaceName].push(implementation);
    }

    public resolveFromDescriptor(descriptorObject: { [id: string]: IInterfaceImplementation[] }): void {
        for (var x in descriptorObject) {
            for (var y in descriptorObject[x]) {
                var impl = descriptorObject[x][y];
                if (impl) {
                    //impl.instantiator = ()=> this.getResolver(x);
                    //this.addImplementationToGraph(x, impl);
                }
            }
        }
    }
}

interface IInterfaceImplementation {
    classReference: string;
    dependencies: string[];
    instantiator: ()=> any;
    prefered: boolean;
}