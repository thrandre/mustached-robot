var IoC;
(function (IoC) {
    function resolve() {
        return null;
    }
    IoC.resolve = resolve;

    function register() {
    }
    IoC.register = register;

    function autoResolve(descriptorObject) {
        IoCContainer.current().tryResolve(descriptorObject);
    }
    IoC.autoResolve = autoResolve;

    var IoCContainer = (function () {
        function IoCContainer() {
            this.graph = new Array();
        }
        IoCContainer.current = function () {
            return IoCContainer.instance !== null ? IoCContainer.instance : (IoCContainer.instance = new IoCContainer());
        };

        IoCContainer.prototype.getClassInstantiator = function (classRef, args) {
            var wrapper = function (f, a) {
                var params = [f].concat(a);
                console.log(f);
                return f.bind.apply(f, params);
            };

            return function () {
                return new (wrapper(eval(classRef), args));
            };
        };

        IoCContainer.prototype.getImplementationForInterface = function (interfaceName) {
            var currentInterface = this.graph.filter(function (inf) {
                return inf.interfaceName === interfaceName;
            })[0];
            return currentInterface.implementedBy[0];
        };

        IoCContainer.prototype.getResolver = function (interfaceName) {
            var _this = this;
            var impl = this.getImplementationForInterface(interfaceName);
            return function () {
                var deps = [];
                for (var dep in impl.dependencies) {
                    deps.push(_this.getResolver(impl.dependencies[dep].interfaceName)());
                }

                return _this.getClassInstantiator(impl.classReference, deps)();
            };
        };

        IoCContainer.prototype.tryResolve = function (descriptorObject) {
            for (var interfaceName in descriptorObject) {
                var meta = new InterfaceMetadata(interfaceName);
                var impls = descriptorObject[interfaceName];

                for (var impl in impls) {
                    var classImpl = impls[impl];
                    var classMeta = new ClassMetadata(classImpl.classReference);

                    for (var dep in classImpl.deps) {
                        classMeta.dependencies.push(new InterfaceMetadata(classImpl.deps[dep]));
                    }

                    meta.implementedBy.push(classMeta);
                }

                this.graph.push(meta);
            }

            var t = this.getResolver("IGreeter")();
            console.log(t.greet("Thomas"));
        };
        IoCContainer.instance = null;
        return IoCContainer;
    })();

    var InterfaceMetadata = (function () {
        function InterfaceMetadata(interfaceName) {
            this.interfaceName = interfaceName;
            this.implementedBy = new Array();
        }
        return InterfaceMetadata;
    })();

    var ClassMetadata = (function () {
        function ClassMetadata(classReference) {
            this.classReference = classReference;
            this.prefered = false;
            this.dependencies = new Array();
        }
        return ClassMetadata;
    })();
})(IoC || (IoC = {}));
/// <reference path="ioc.ts" />

var Greeter = (function () {
    function Greeter(medium) {
        this.medium = medium;
    }
    Greeter.prototype.greet = function (name) {
        this.medium.write("Hello " + name);
    };
    return Greeter;
})();

var ConsoleGreeter = (function () {
    function ConsoleGreeter() {
    }
    ConsoleGreeter.prototype.write = function (greeting) {
        console.log(greeting);
    };
    return ConsoleGreeter;
})();

IoC.autoResolve(window["dependencies"]);
