Array.prototype.asEnumerable = function <T>() {
    return new EnumerableArray<T>(this);
};

interface Array<T> {
    asEnumerable: () => IEnumerable<T>;
}

interface IEnumerable<T> {
    getEnumerator: () => IEnumerator<T>;
    where: (predicate: IPredicate<T>) => IEnumerable<T>;
    first: (predicate?: IPredicate<T>) => T;
}

interface IPredicate<T> {
    (item: T): boolean;
}

class EnumerableArray<T> implements IEnumerable<T> {
    public storage: T[];

    public getEnumerator(): IEnumerator<T> {
        return new ArrayEnumerator((i) => this.storage[i]);
    }

    public where(predicate: IPredicate<T>): IEnumerable<T> {
        var item: T;
        var enumerator = this.getEnumerator();

        var result = new Array<T>();

        while ((item = enumerator.next()) !== null) {
            if (predicate(item)) {
                result.push(item);
            }
        }

        return result.asEnumerable();
    }

    public first(predicate?: IPredicate<T>): T {
        var item: T;
        var enumerator = this.getEnumerator();

        while ((item = enumerator.next()) !== null) {
            if (predicate) {
                if (predicate(item)) {
                    return item;
                }
            } else {
                return item;
            }
        }

        throw new Error("No items in sequence.");
    }



    constructor(arr?: T[]) {
        if (arr) {
            this.storage = arr;
        } else {
            this.storage = new Array<T>();
        }
    }
}

interface IEnumerator<T> {
    current: T;
    next: () => T;
    reset: () => void;
}

class ArrayEnumerator<T> implements IEnumerator<T> {

    private currentIndex: number;
    private accessor: (index: number) => T;

    get current(): T {
        return this.accessor(this.currentIndex);
    }

    public next(): T {
        var next = this.current;

        if (next) {
            this.currentIndex++;
            return next;
        }

        return null;
    }

    public reset() {
        this.currentIndex = 0;
    }

    constructor(accessor: (index: number) => T) {
        this.currentIndex = 0;
        this.accessor = accessor;
    }

}

interface IList<T> {
    count: number;
    add: (item: T) => void;
    get: (index: number) => T;
    remove: (index: number) => void;
}