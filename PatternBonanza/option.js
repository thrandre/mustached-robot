Object.prototype.may = function () {
    return new Opt(this);
};

Number.prototype.may = function () {
    return new Opt(this);
};

String.prototype.may = function () {
    return new Opt(this);
};

var Opt = (function () {
    function Opt(value, hasValue) {
        if (typeof hasValue === "undefined") { hasValue = true; }
        this.valueStore = value;
        this.valueSet = hasValue;
    }
    Object.defineProperty(Opt.prototype, "hasValue", {
        get: function () {
            return this.valueSet;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Opt.prototype, "value", {
        get: function () {
            return this.hasValue ? this.valueStore : (this.otherwise ? this.otherwiseFunc() : this.valueStore);
        },
        set: function (val) {
            this.valueStore = val;
            this.valueSet = true;
        },
        enumerable: true,
        configurable: true
    });


    Opt.prototype.otherwise = function (other) {
        this.otherwiseFunc = other;
        return this;
    };

    Opt.noVal = function () {
        return new Opt(null, false);
    };
    return Opt;
})();
//# sourceMappingURL=option.js.map
