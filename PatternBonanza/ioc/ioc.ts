/// <reference path="../require.d.ts"/>
/// <reference path="../deferred/deferred.d.ts"/>

export interface IResolvedCallback<T> {
    (instance: T): void;
}

export interface IImplementationRecord {
    module: string;
    classReference: string;
    dependencies: string[];
    scope: number;

    prefered: boolean;
    instantiate: () => IDeferred.IPromise<any>;
}

export interface IIoCContainerConfiguration {
    deferredFactory: IDeferred.IDeferredFactory;
}

interface IManifest {
    [id: string]: IImplementationRecord[];
}

export class IInterface<T> {
    interfaceName: string;
    methods: string[];
    enforcer: T;
}

export enum Scope {
    Instance,
    Singleton
}

export function setup(settings: IIoCContainerConfiguration): void {
    IoCContainer.current(settings);
}

export function resolve<T>(iinterface: IInterface<T>): IDeferred.IPromise<T> {
    return IoCContainer.current().resolve(iinterface.interfaceName);
}

function register<T>(iinterface: IInterface<T>, instance: T): void {

}

export function autoResolve(manifest: { [id: string]: IImplementationRecord[] }): void {
    IoCContainer.current().registerManifest(manifest);
}

class InstanceResolver {
    private _instances: { [id: string]: any } = {};

    constructor(private _graph: ManifestWrapper, private _deferredFactory: IDeferred.IDeferredFactory) { }

    public loadModule(moduleName: string): IDeferred.IPromise<any> {
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

    public resolveDependencies(interfaceName: string): () => IDeferred.IPromise<any> {
        return this.resolveImpl(this.getImpl(interfaceName));
    }

    public resolveImpl(implRecord: IImplementationRecord): () => IDeferred.IPromise<any> {
        var instantiator = () => {
            var deps: IDeferred.IPromise<any>[] = [];

            for (var x in implRecord.dependencies)
                deps.push(this.resolveDependencies(implRecord.dependencies[x])());

            return this._deferredFactory.utils.whenAll(deps).then(args =>
                this.getInstantiator(implRecord.module, implRecord.classReference, args)());
        };

        if (implRecord.scope === Scope.Instance) {
            return instantiator;
        }

        if (implRecord.scope === Scope.Singleton) {
            return () => {
                var qualname = implRecord.module + "." + implRecord.classReference;
                var deferred = this._deferredFactory.create();

                if (this._instances[qualname]) {
                    console.log("It exists");
                    return deferred.resolve(this._instances[qualname]).promise();
                }

                return instantiator().then(instance => {
                    console.log(this._instances);
                    this._instances[qualname] = instance;
                    return instance;
                });
            };
        }
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

    static current(config?: IIoCContainerConfiguration): IoCContainer {
        if (!config && !IoCContainer.instance)
            throw new Error("Unable to return instance of container: No configuration provided.");

        return config
            ? (IoCContainer.instance = new IoCContainer(config))
            : IoCContainer.instance;
    }

    private get settings(): IIoCContainerConfiguration {
        return this._settings;
    }

    private _interfaceGraph: ManifestWrapper;
    private _resolver: InstanceResolver;

    constructor(private _settings: IIoCContainerConfiguration) {
        this._interfaceGraph = new ManifestWrapper({});
        this._resolver = new InstanceResolver(this._interfaceGraph, this.settings.deferredFactory);
    }

    public resolve(interfaceName: string): IDeferred.IPromise<any> {
        return this._resolver.getImpl(interfaceName).instantiate();
    }

    public registerManifest(manifest: IManifest): void {
        for (var x in manifest) {
            for (var y in manifest[x]) {
                var impl = manifest[x][y];
                impl.instantiate = this._resolver.resolveImpl(impl);
                this._interfaceGraph.addImplementation(x, impl);
            }
        }
    }
}

class ManifestWrapper {
    constructor(private _store: IManifest) {}

    public isInterfaceDeclared(name: string): boolean {
        return !!this._store[name];
    }

    public getInterface(name: string): IImplementationRecord[] {
        return this._store[name];
    }

    public addInterface(name: string): void {
        if (this.isInterfaceDeclared(name)) return;
        this._store[name] = [];
    }

    public addImplementation(interfaceName: string, impl: IImplementationRecord): void {
        this.addInterface(interfaceName);
        this._store[interfaceName].push(impl);
    }
}