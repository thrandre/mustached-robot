define(["require", "exports"], function(require, exports) {
    (function (Status) {
        Status[Status["Unfulfilled"] = 0] = "Unfulfilled";
        Status[Status["Resolved"] = 1] = "Resolved";
        Status[Status["Rejected"] = 2] = "Rejected";
    })(exports.Status || (exports.Status = {}));
    var Status = exports.Status;
});
//# sourceMappingURL=ideferred.js.map
