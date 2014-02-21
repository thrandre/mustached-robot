/// <reference path="../require.d.ts"/>
/// <reference path="../deferred/deferred.d.ts"/>
define(["require", "exports"], function(require, exports) {
    

    var IInterface = (function () {
        function IInterface() {
        }
        return IInterface;
    })();
    exports.IInterface = IInterface;

    (function (Scope) {
        Scope[Scope["Instance"] = 0] = "Instance";
        Scope[Scope["Singleton"] = 1] = "Singleton";
    })(exports.Scope || (exports.Scope = {}));
    var Scope = exports.Scope;

    function setup(settings) {
        IoCContainer.current(settings);
    }
    exports.setup = setup;

    function resolve(iinterface) {
        return IoCContainer.current().resolve(iinterface);
    }
    exports.resolve = resolve;

    function resolveAll() {
        var iinterfaces = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            iinterfaces[_i] = arguments[_i + 0];
        }
        return IoCContainer.current().resolveAll(iinterfaces);
    }
    exports.resolveAll = resolveAll;

    function register(iinterface, instance) {
    }

    function autoResolve(manifest) {
        IoCContainer.current().registerManifest(manifest);
    }
    exports.autoResolve = autoResolve;

    var InstanceResolver = (function () {
        function InstanceResolver(_manifest, _deferredFactory) {
            this._manifest = _manifest;
            this._deferredFactory = _deferredFactory;
            this._instances = {};
        }
        InstanceResolver.prototype.loadModule = function (moduleName) {
            var deferred = this._deferredFactory.create();
            require([moduleName], function (m) {
                return deferred.resolve(m);
            });
            return deferred.promise();
        };

        InstanceResolver.prototype.getInstantiator = function (module, classReference, args) {
            var _this = this;
            var instantiatorWrapper = function (f, a) {
                var params = [f].concat(a);
                return f.bind.apply(f, params);
            };

            return function () {
                return _this.loadModule(module).then(function (m) {
                    return new (instantiatorWrapper(m[classReference], args));
                });
            };
        };

        InstanceResolver.prototype.resolveDependencies = function (interfaceName) {
            return this.resolveImpl(this.getImpl(interfaceName));
        };

        InstanceResolver.prototype.resolveImpl = function (implRecord) {
            var _this = this;
            var instantiator = function () {
                var deps = [];

                for (var x in implRecord.dependencies)
                    deps.push(_this.resolveDependencies(implRecord.dependencies[x])());

                return _this._deferredFactory.utils.whenAll(deps).then(function (args) {
                    return _this.getInstantiator(implRecord.module, implRecord.classReference, args)();
                });
            };

            if (implRecord.scope === 1 /* Singleton */) {
                return function () {
                    var qualname = implRecord.module + "." + implRecord.classReference;

                    if (_this._instances[qualname])
                        return _this._deferredFactory.create().resolve(_this._instances[qualname]).promise();

                    return instantiator().then(function (instance) {
                        _this._instances[qualname] = instance;
                        return instance;
                    });
                };
            }

            return instantiator;
        };

        InstanceResolver.prototype.getImpl = function (interfaceName) {
            var impls = this._manifest.getInterface(interfaceName);

            if (!impls || impls.length === 0)
                throw new Error("No implementations registered for " + interfaceName);

            for (var i in impls)
                if (impls[i].prefered)
                    return impls[i];

            return impls[0];
        };
        return InstanceResolver;
    })();

    var IoCContainer = (function () {
        function IoCContainer(_settings) {
            this._settings = _settings;
            this._interfaceGraph = new ManifestWrapper({});
            this._resolver = new InstanceResolver(this._interfaceGraph, this._settings.deferredFactory);
        }
        IoCContainer.current = function (config) {
            if (!config && !IoCContainer.instance)
                throw new Error("Unable to return instance of container: No configuration provided.");

            return config ? (IoCContainer.instance = new IoCContainer(config)) : IoCContainer.instance;
        };

        IoCContainer.prototype.resolve = function (iinterface) {
            return this._resolver.getImpl(iinterface.interfaceName).instantiate();
        };

        IoCContainer.prototype.resolveAll = function (iinterfaces) {
            var resolvers = [];
            for (var i in iinterfaces) {
                resolvers.push(this._resolver.getImpl(iinterfaces[i].interfaceName).instantiate());
            }

            return this._settings.deferredFactory.utils.whenAll(resolvers);
        };

        IoCContainer.prototype.registerManifest = function (manifest) {
            for (var x in manifest) {
                for (var y in manifest[x]) {
                    var impl = manifest[x][y];

                    impl.instantiate = this._resolver.resolveImpl(impl);

                    if (!impl.dependencies)
                        impl.dependencies = [];

                    this._interfaceGraph.addImplementation(x, impl);
                }
            }
        };
        IoCContainer.instance = null;
        return IoCContainer;
    })();

    var ManifestWrapper = (function () {
        function ManifestWrapper(_store) {
            this._store = _store;
        }
        ManifestWrapper.prototype.isInterfaceDeclared = function (name) {
            return !!this._store[name];
        };

        ManifestWrapper.prototype.getInterface = function (name) {
            return this._store[name];
        };

        ManifestWrapper.prototype.addInterface = function (name) {
            if (this.isInterfaceDeclared(name))
                return;
            this._store[name] = [];
        };

        ManifestWrapper.prototype.addImplementation = function (interfaceName, impl) {
            this.addInterface(interfaceName);
            this._store[interfaceName].push(impl);
        };
        return ManifestWrapper;
    })();
});
//# sourceMappingURL=ioc.js.map
