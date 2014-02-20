var dependencies = {
	"IGreeter": [
		{
			module: "app",
			classReference: "Greeter",
			dependencies: ["IMedium"],
			scope: 0
		}
	],
	"IMedium": [
		{
			module: "app",
			classReference: "ConsoleGreeter",
			dependencies: [],
			scope: 0
		}
	],
	"IDeferredFactory": [
		{
			module: "deferred",
			classReference: "DeferredFactory",
			dependencies: [],
			scope: 0
		}
	]
};