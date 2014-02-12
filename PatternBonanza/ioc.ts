module IoC {
	export function resolve<T>() : T {
		return null;
	}
	
	export function register() : void {
		
	}
	
	export function autoResolve(descriptorObject: {string: Array<any>}): void {
		IoCContainer.current().tryResolve(descriptorObject);
	}
	
	class IoCContainer {
		static instance : IoCContainer = null;	
		static current() : IoCContainer {
			return IoCContainer.instance !== null 
				? IoCContainer.instance 
				: (IoCContainer.instance = new IoCContainer());
		}
		
		private graph : Array<InterfaceMetadata> = new Array<InterfaceMetadata>();
		
		private getClassInstantiator(classRef: string, args: any[]): () => any {
			var wrapper = (f, a) => {
			    var params = [f].concat(a);
			    console.log(f);
				return f.bind.apply(f, params);
			};
			
			return () => new (wrapper(eval(classRef), args));	
		}
		
		private getImplementationForInterface(interfaceName: string) : ClassMetadata {
			var currentInterface = this.graph.filter(inf => inf.interfaceName === interfaceName)[0];
			return currentInterface.implementedBy[0];			
		}
		
		private getResolver(interfaceName: string) : () => any {
			var impl = this.getImplementationForInterface(interfaceName);
			return () => {
				var deps = [];
				for(var dep in impl.dependencies) {
					deps.push(this.getResolver(impl.dependencies[dep].interfaceName)());
				}
				
				return this.getClassInstantiator(impl.classReference, deps)();	
			};
		}
				
		public tryResolve(descriptorObject: {string: Array<any>}): void {
			for(var interfaceName in descriptorObject) {
				var meta = new InterfaceMetadata(interfaceName);	
				var impls = descriptorObject[interfaceName];
				
				for(var impl in impls) {
					var classImpl = impls[impl];
					var classMeta = new ClassMetadata(classImpl.classReference);
					
					for(var dep in classImpl.deps) {
						classMeta.dependencies.push(new InterfaceMetadata(classImpl.deps[dep]));
					}
					
					meta.implementedBy.push(classMeta);
				}	
				
				this.graph.push(meta);
			}
			
			var t = this.getResolver("IGreeter")();
			console.log(t.greet("Thomas"));
		}	
	}
	
	class InterfaceMetadata {
		public implementedBy: Array<ClassMetadata> = new Array<ClassMetadata>();
		constructor(public interfaceName: string) {}
	}
	
	class ClassMetadata {
		public prefered: boolean = false;
		public dependencies: Array<InterfaceMetadata> = new Array<InterfaceMetadata>();
		constructor(public classReference: string) {}
	}
}