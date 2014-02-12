///// <reference path="linq.ts"/>
//
//module IoC {
//    export function resolve<T>(): T {
//		return null;
//	}
//	
//	export function register() : void {
//		
//	}
//	
//	export function autoResolve(descriptorObject: { string: Array<any> }): void {
//		IoCContainer.current().tryResolve(descriptorObject);
//	}
//	
//	class IoCContainer {
//		static instance : IoCContainer = null;	
//		static current() : IoCContainer {
//			return IoCContainer.instance !== null 
//				? IoCContainer.instance 
//				: (IoCContainer.instance = new IoCContainer());
//		}
//		
//        private graph: { [id: string]: IInterfaceImplementation[] } = {};
//
//	    private getClassInstantiator(classRef: string, args: any[]): () => any {
//			var wrapper = (f, a) => {
//			    var params = [f].concat(a);
//				return f.bind.apply(f, params);
//			};
//			
//			return () => new (wrapper(eval(classRef), args));	
//		}
//		
//		private getImplementationForInterface(interfaceName: string) : ClassMetadata {
//			var currentInterface = this.graph.filter(inf => inf.interfaceName === interfaceName)[0];
//			return currentInterface.implementedBy[0];			
//		}
//		
//		private getResolver(interfaceName: string) : () => any {
//			var impl = this.getImplementationForInterface(interfaceName);
//			return () => {
//				var deps = [];
//				for(var dep in impl.dependencies) {
//					deps.push(this.getResolver(impl.dependencies[dep].interfaceName)());
//				}
//				
//				return this.getClassInstantiator(impl.classReference, deps)();	
//			};
//		}
//				
//        public tryResolve(descriptorObject: { [id: string]: IInterfaceImplementation[] }): void {
//            Object.keys(descriptorObject).map(impl=> {});
//            for (var ifaceName in descriptorObject) {
//                for (var iimpl in descriptorObject[ifaceName]) {
//                }
//            }
//		}	
//    }
//
//    interface IInterfaceImplementation {
//        classReference: string;
//        deps: string[];
//        instantiator: () => any;
//        prefered: boolean;
//    }
//}