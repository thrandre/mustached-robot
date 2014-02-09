interface Object {
    may: <T>() => IOpt<T>;
}

interface Number {
    may: () => IOpt<number>;
}

interface String {
    may: () => IOpt<string>;
}

Object.prototype.may = function () {
    return new Opt<any>(this);
};

Number.prototype.may = function () {
    return new Opt<number>(this);
};

String.prototype.may = function () {
    return new Opt<string>(this);
};

interface IOpt<T> {
    hasValue: boolean;
    value: T;
    otherwise(other: () => T): IOpt<T>;
}

class Opt<T> implements IOpt<T> {
    private valueStore: T;
    private valueSet: boolean;

    private otherwiseFunc: () => T;

    get hasValue(): boolean {
        return this.valueSet;
    }

    get value(): T {
        return this.hasValue
            ? this.valueStore
            : (this.otherwiseFunc
            ? this.otherwiseFunc()
            : this.valueStore);
    }

    set value(val: T) {
        this.valueStore = val;
        this.valueSet = true;
    }

    public otherwise(other: () => T): IOpt<T> {
        this.otherwiseFunc = other;
        return this;
    }

    constructor(value?: T, hasValue: boolean = true) {
        this.valueStore = value;
        this.valueSet = hasValue;
    }

    static noVal<T>(): IOpt<T> {
        return new Opt<T>(null, false);
    }
} 