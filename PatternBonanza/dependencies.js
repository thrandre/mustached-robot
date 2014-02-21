var dependencies = {
	"IGreeter": [
		{
			module: "app",
			classReference: "Greeter",
			dependencies: ["IMedium"],
			scope: 1 /* singleton */
		}
	],
	"IMedium": [
		{
			module: "app",
			classReference: "ConsoleGreeter",
			dependencies: [],
			scope: 1 /* singleton */
		}
	],
	"IEnumerableFactory": [
		{
			module: "linq/linq",
			classReference: "EnumerableFactory",
			dependencies: [],
			scope: 1
		}
	]
};