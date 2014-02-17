///<reference path="require.d.ts"/>

export interface Interface {
    interfaceName: string;
}

export interface IResolvedCallback<T> {
    (instance: T): void;
}

interface IInterfaceImplementation {
    classReference: string;
    dependencies: string[];
    instantiator: () => any;
    prefered: boolean;
    scope: Scope;
}

export enum Scope {
    Instance,
    Singleton
}

export class InterfaceTypeEnforcer<T> {
    enforcer: T;
}

export function setup(settings: IoCContainerSettings) {
    IoCContainer.current().settings = settings;
}

export function resolve<T>(iinterface: InterfaceTypeEnforcer<T>, resolvedCallback: IResolvedCallback<T>): T {
    return null;
}

function register<T>(iinterface: InterfaceTypeEnforcer<T>, instance: T): void {

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

export interface IRejection {
    message: string;
}

export interface IPromise<T> {
    
}

export interface IDeferred<T> {
    promise(): IPromise<T>;
    resolve(result: T): IDeferred<T>;
    reject(): IDeferred<T>;
}

export interface IDeferredFactory {
    create<T>() : IDeferred<T>;
}

export interface IModuleLoader {
    load(deps: string[], callback: any): void;
}

export interface IoCContainerSettings {
    moduleLoader: IModuleLoader;
    deferredFactory: IDeferredFactory;
}

class IoCContainer {
    static instance: IoCContainer = null;

    static current(settings?: IoCContainerSettings): IoCContainer {
        return IoCContainer.instance
            ? IoCContainer.instance
            : (IoCContainer.instance = new IoCContainer());
    }

    private containerSettings: IoCContainerSettings = null;
    get settings(): IoCContainerSettings {
        if (!this.containerSettings) {
            throw new Error("The container is not configured.");
        }
        return this.containerSettings;
    }
    set settings(settings: IoCContainerSettings) {
        this.containerSettings = settings;
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