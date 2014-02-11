var Test;
(function (Test) {
    var Waste = (function () {
        function Waste() {
        }
        Waste.prototype.sayHello = function () {
            console.log("Fuck off!");
        };
        return Waste;
    })();
    Test.Waste = Waste;
})(Test || (Test = {}));
