///<reference path="require.d.ts"/>
define(["require", "exports"], function(require, exports) {
    

    function resolve(iinterface, resolvedCallback) {
        return null;
    }
    exports.resolve = resolve;

    function resolveAll() {
        return null;
    }

    function register() {
    }

    function autoResolve(descriptorObject) {
        IoCContainer.current().resolveFromDescriptor(descriptorObject);
    }

    var Resolver = (function () {
        function Resolver() {
        }
        Resolver.prototype.getClassInstantiator = function (classReference, args) {
            var wrapper = function (f, a) {
                var params = [f].concat(a);
                return f.bind.apply(f, params);
            };

            return function () {
                return new (wrapper(eval(classReference), args));
            };
        };

        Resolver.prototype.getImplementationForInterface = function (interfaceName) {
            return null;
        };

        Resolver.prototype.getResolver = function (interfaceName) {
            var _this = this;
            var impl = this.getImplementationForInterface(interfaceName);
            return function () {
                var deps = [];
                for (var dep in impl.dependencies) {
                    deps.push(_this.getResolver(impl.dependencies[dep])());
                }

                return _this.getClassInstantiator(impl.classReference, deps)();
            };
        };
        return Resolver;
    })();

    var IoCContainer = (function () {
        function IoCContainer() {
            this.graph = {};
        }
        IoCContainer.current = function () {
            return IoCContainer.instance ? IoCContainer.instance : (IoCContainer.instance = new IoCContainer());
        };

        IoCContainer.prototype.addImplementationToGraph = function (interfaceName, implementation) {
            if (!this.graph[interfaceName]) {
                this.graph[interfaceName] = [];
            }
            this.graph[interfaceName].push(implementation);
        };

        IoCContainer.prototype.resolveFromDescriptor = function (descriptorObject) {
            for (var x in descriptorObject) {
                for (var y in descriptorObject[x]) {
                    var impl = descriptorObject[x][y];
                    if (impl) {
                        //impl.instantiator = ()=> this.getResolver(x);
                        //this.addImplementationToGraph(x, impl);
                    }
                }
            }
        };
        IoCContainer.instance = null;
        return IoCContainer;
    })();
});
//# sourceMappingURL=ioc.js.map
