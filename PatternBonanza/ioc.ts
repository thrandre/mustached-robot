/// <reference path="require.d.ts"/>
/// <reference path="deferred/deferred.d.ts"/>

export interface IResolvedCallback<T> {
    (instance: T): void;
}

export enum Scope {
    Instance,
    Singleton
}

export class IInterface<T> {
    interfaceName: string;
    methods: string[];
    enforcer: T;
}

export function resolve<T>(iinterface: IInterface<T>): Deferred.IPromise<T> {
    return IoCContainer.current().resolve(iinterface.interfaceName);
}

function register<T>(iinterface: IInterface<T>, instance: T): void {

}

export function autoResolve(descriptorObject: { [id: string]: IImplementationRecord[] }): void {
    IoCContainer.current().registerFromDescriptor(descriptorObject);
}

class InstanceResolver {
    constructor(private _graph: InterfaceGraph, private _deferredFactory: Deferred.IDeferredFactory) {}

    public loadModule(moduleName: string): Deferred.IPromise<any> {
        var deferred = this._deferredFactory.create();
        require([moduleName], m => deferred.resolve(m));
        return deferred.promise();
    }

    public getInstantiator(module: string, classReference: string, args: any[]): () => any {
        var instantiatorWrapper = (f, a) => {
            var params = [f].concat(a);
            return f.bind.apply(f, params);
        };

        return () => {
            return this.loadModule(module).then(m => {
                return new (instantiatorWrapper(m[classReference], args));
            });
        };
    }

    public resolveDependencies(interfaceName: string): () => Deferred.IPromise<any> {
        return this.resolveImpl(this.getImpl(interfaceName));
    }

    public resolveImpl(implRecord: IImplementationRecord): () => Deferred.IPromise<any> {
        return () => {
            var deps: Deferred.IPromise<any>[] = [];

            for (var x in implRecord.dependencies)
                deps.push(this.resolveDependencies(implRecord.dependencies[x])());

            return Deferred.whenAll(deps).then(args =>
                this.getInstantiator(implRecord.module, implRecord.classReference, args)());
        };
    }

    public getImpl(interfaceName: string): IImplementationRecord {
        var impls = this._graph.getInterface(interfaceName);
        for (var i in impls)
            if (impls[i].prefered)
                return impls[i];

        return impls[0];
    }
}

class IoCContainer {
    static instance: IoCContainer = null;

    static current(): IoCContainer {
        return IoCContainer.instance
            ? IoCContainer.instance
            : (IoCContainer.instance = new IoCContainer());
    }

    private _interfaceGraph: InterfaceGraph;
    private _resolver: InstanceResolver;

    constructor() {
        this._interfaceGraph = new InterfaceGraph();
        this._resolver = new InstanceResolver(this._interfaceGraph);
    }

    public resolve(interfaceName: string): IPromise<any> {
        return this._resolver.getImpl(interfaceName).instantiate();
    }

    public registerFromDescriptor(descriptor: IInterfaceStore): void {
        for (var x in descriptor) {
            for (var y in descriptor[x]) {
                var impl = descriptor[x][y];
                impl.instantiate = this._resolver.resolveImpl(impl);
                this._interfaceGraph.addImplementation(x, impl);
            }
        }
    }
}

class InterfaceGraph {
    private _store: IInterfaceStore = {};

    public interfaceDeclared(name: string): boolean {
        return !!this._store[name];
    }

    public getInterface(name: string): IImplementationRecord[] {
        return this._store[name];
    }

    public addInterface(name: string): void {
        if (this.interfaceDeclared(name))
            return;
        this._store[name] = [];
    }

    public addImplementation(interfaceName: string, impl: IImplementationRecord): void {
        this.addInterface(interfaceName);
        this._store[interfaceName].push(impl);
    }
}

export interface IImplementationRecord {
    module: string;
    classReference: string;
    dependencies: string[];
    scope: Scope;

    prefered: boolean;
    instantiate: () => IPromise<any>;
}

interface IInterfaceStore {
    [id: string]: IImplementationRecord[];
}