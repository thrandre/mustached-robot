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

    function resolve(iinterface) {
        return IoCContainer.current().resolve(iinterface.interfaceName);
    }
    exports.resolve = resolve;

    function register(iinterface, instance) {
    }

    function autoResolve(descriptorObject) {
        IoCContainer.current().registerFromDescriptor(descriptorObject);
    }
    exports.autoResolve = autoResolve;

    var InstanceResolver = (function () {
        function InstanceResolver(_graph, _deferredFactory) {
            this._graph = _graph;
            this._deferredFactory = _deferredFactory;
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
            return function () {
                var deps = [];

                for (var x in implRecord.dependencies)
                    deps.push(_this.resolveDependencies(implRecord.dependencies[x])());

                return _this._deferredFactory.utils.whenAll(deps).then(function (args) {
                    return _this.getInstantiator(implRecord.module, implRecord.classReference, args)();
                });
            };
        };

        InstanceResolver.prototype.getImpl = function (interfaceName) {
            var impls = this._graph.getInterface(interfaceName);
            for (var i in impls)
                if (impls[i].prefered)
                    return impls[i];

            return impls[0];
        };
        return InstanceResolver;
    })();

    var IoCContainer = (function () {
        function IoCContainer() {
            this._interfaceGraph = new InterfaceGraph();
            this._deferredFactory = null;
            this._resolver = new InstanceResolver(this._interfaceGraph, this._deferredFactory);
        }
        IoCContainer.current = function () {
            return IoCContainer.instance ? IoCContainer.instance : (IoCContainer.instance = new IoCContainer());
        };

        IoCContainer.prototype.resolve = function (interfaceName) {
            return this._resolver.getImpl(interfaceName).instantiate();
        };

        IoCContainer.prototype.registerFromDescriptor = function (descriptor) {
            for (var x in descriptor) {
                for (var y in descriptor[x]) {
                    var impl = descriptor[x][y];
                    impl.instantiate = this._resolver.resolveImpl(impl);
                    this._interfaceGraph.addImplementation(x, impl);
                }
            }
        };
        IoCContainer.instance = null;
        return IoCContainer;
    })();

    var InterfaceGraph = (function () {
        function InterfaceGraph() {
            this._store = {};
        }
        InterfaceGraph.prototype.interfaceDeclared = function (name) {
            return !!this._store[name];
        };

        InterfaceGraph.prototype.getInterface = function (name) {
            return this._store[name];
        };

        InterfaceGraph.prototype.addInterface = function (name) {
            if (this.interfaceDeclared(name))
                return;
            this._store[name] = [];
        };

        InterfaceGraph.prototype.addImplementation = function (interfaceName, impl) {
            this.addInterface(interfaceName);
            this._store[interfaceName].push(impl);
        };
        return InterfaceGraph;
    })();
});
//# sourceMappingURL=ioc.js.map
