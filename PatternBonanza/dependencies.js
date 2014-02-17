var dependencies = {
	"IMedium": [
		{
			classReference: "ConsoleGreeter",
			dependencies: [],
			scope: 0 /* 0 = instance, 1 = singleton */
		}	
	],
	"IGreeter": [
		{
			classReference: "Greeter",
			dependencies: ["IMedium"],
			scope: 0 /* 0 = instance, 1 = singleton */
		}
	]
};