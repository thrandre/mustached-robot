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
			scope: 0 /* instance */
		}
	]
};