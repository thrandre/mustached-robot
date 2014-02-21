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
    return IoCContainer.current().resolve(iinterface);
}

export function resolveAll(...iinterfaces: IInterface<any>[]): IDeferred.IPromise<any[]> {
    return IoCContainer.current().resolveAll(iinterfaces);
}

function register<T>(iinterface: IInterface<T>, instance: T): void {

}

export function autoResolve(manifest: { [id: string]: IImplementationRecord[] }): void {
    IoCContainer.current().registerManifest(manifest);
}

class InstanceResolver {
    private _instances: { [id: string]: any } = {};

    constructor(private _manifest: ManifestWrapper, private _deferredFactory: IDeferred.IDeferredFactory) { }

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

        if (implRecord.scope === Scope.Singleton) {
            return () => {
                var qualname = implRecord.module + "." + implRecord.classReference;

                if (this._instances[qualname])
                    return this._deferredFactory.create().resolve(this._instances[qualname]).promise();

                return instantiator().then(instance => {
                    this._instances[qualname] = instance;
                    return instance;
                });
            };
        }

        return instantiator;
    }

    public getImpl(interfaceName: string): IImplementationRecord {
        var impls = this._manifest.getInterface(interfaceName);

        if (!impls || impls.length === 0)
            throw new Error("No implementations registered for " + interfaceName);

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

    private _interfaceGraph: ManifestWrapper;
    private _resolver: InstanceResolver;

    constructor(private _settings: IIoCContainerConfiguration) {
        this._interfaceGraph = new ManifestWrapper({});
        this._resolver = new InstanceResolver(this._interfaceGraph, this._settings.deferredFactory);
    }

    public resolve<T>(iinterface: IInterface<T>): IDeferred.IPromise<T> {
        return this._resolver.getImpl(iinterface.interfaceName).instantiate();
    }

    public resolveAll(iinterfaces: IInterface<any>[]): IDeferred.IPromise<any[]> {
        var resolvers = [];
        for (var i in iinterfaces) {
            resolvers.push(this._resolver.getImpl(iinterfaces[i].interfaceName).instantiate());
        }

        return this._settings.deferredFactory.utils.whenAll(resolvers);
    }

    public registerManifest(manifest: IManifest): void {
        for (var x in manifest) {
            for (var y in manifest[x]) {
                var impl = manifest[x][y];

                impl.instantiate = this._resolver.resolveImpl(impl);

                if (!impl.dependencies)
                    impl.dependencies = [];

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