var dependencies = {
	"IMedium": [
		{
			classReference: "ConsoleGreeter",
			deps: []
		}	
	],
	"IGreeter": [
		{
			classReference: "Greeter",
			deps: ["IMedium"]
		}
	]
};