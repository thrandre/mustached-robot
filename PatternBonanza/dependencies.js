var dependencies = {
	"IMedium": [
		{
			classReference: "ConsoleGreeter",
			dependencies: []
		}	
	],
	"IGreeter": [
		{
			classReference: "Greeter",
			dependencies: ["IMedium"]
		}
	]
};