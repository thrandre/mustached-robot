/// <reference path="common.ts"/>

interface IEnumerable<TIn> {
    getEnumerator: ()=> IEnumerator<TIn>;
    count: (predicate?: IPredicate<TIn>) => number;
    where: (predicate: IPredicate<TIn>) => IEnumerable<TIn>;
    first: (predicate?: IPredicate<TIn>) => TIn;
    each: (action: IAction<TIn>) => void;
    select: <TOut>(selector: ISelector<TIn, TOut>) => IEnumerable<TOut>;
    aggregate: (aggregator: IAggFunc<TIn>) => TIn;
}

interface IPredicate<TIn> {
    (item: TIn): boolean;
}

interface IAction<TIn> {
    (item: TIn): void;
};

interface ISelector<TIn, TOut> {
    (item: TIn): TOut;
}

interface IAggFunc<TIn> {
    (agg: TIn, next: TIn): TIn;
}

class IterationResult<TIn> {
    constructor(public result: TIn, public shouldBreak: boolean) {}
}

class FilterAggregator<TIn> {
    private storage: TIn[];

    public aggregate(item: TIn): void {
        this.storage.push(item);
    }

    public aggregationResult(): IEnumerable<TIn> {
        return new EnumerableArray(this.storage);
    }
}

class Aggregator<TIn> {
    private storage: TIn[] = [];

    public aggregate(item: TIn): void {
        this.aggregatorKernel(this.storage, item);
    }

    public aggregationResult(): IEnumerable<TIn> {
        return new EnumerableArray(this.storage);
    }

    constructor(private aggregatorKernel: IAggregatorKernel<TIn>) {}
}

interface IIteratorKernel<TIn, TOut> {
    (item: TIn): IterationResult<TOut>
}

interface IAggregatorKernel<TIn> {
    (storage: TIn[], item: TIn): void;
}

class EnumerableArray<TIn> implements IEnumerable<TIn> {
    public storage: TIn[];

    public getEnumerator(): IEnumerator<TIn> {
        return new ArrayEnumerator((i)=> this.storage[i]);
    }

    private iterate<TOut>(iterator: IIteratorKernel<TIn, TOut>): IEnumerable<TOut> {
        return this.doIterate(iterator, (agg, next)=> agg.push(next));
    }

    private aggregateIterate(aggregator: IAggFunc<TIn>): TIn {
        var getDefaultValueForType = (value: any): any=> {
            if (typeof value === "number") {
                return 0;
            }
            return "";
        };

        return this.doIterate(
            item=> new IterationResult(item, false),
            (agg, next)=> {
                if (typeof agg[0] === "undefined") {
                    agg[0] = getDefaultValueForType(next);
                }

                agg[0] = aggregator(agg[0], next);
            }).first();
    }

    private doIterate<TOut>(
        iterator: IIteratorKernel<TIn, TOut>,
        aggregator: IAggregatorKernel<TOut>): IEnumerable<TOut> {

        var currentItem: TIn;
        var enumerator = this.getEnumerator();

        var resultAggregator = new Aggregator(aggregator);

        while ((currentItem = enumerator.next()) !== null) {
            var iteration = iterator(currentItem);

            if (iteration.result !== null) {
                resultAggregator.aggregate(iteration.result);
            }

            if (iteration.shouldBreak) {
                break;
            }
        }

        return resultAggregator.aggregationResult();
    }

    public getItem(index: number): TIn {
        return this.storage[index];
    }

    public count(predicate?: IPredicate<TIn>): number {
        if (!predicate) {
            return this.storage.length;
            
        }

        return this.where(predicate).count();
    }

    public where(predicate: IPredicate<TIn>): IEnumerable<TIn> {
        return this.iterate(item => {
            if (predicate(item)) {
                return new IterationResult(item, false);
            } else {
                return new IterationResult(null, false);
            }
        });
    }

    public first(predicate?: IPredicate<TIn>): TIn {
        if (!predicate) {
            return this.getItem(0);
        }

        var result = this.iterate(item => {
            if (predicate(item)) {
                return new IterationResult(item, true);
            } else {
                return new IterationResult(null, false);
            }
        });

        if (result.count() > 0) {
            return this.getItem(0);
        } else {
            throw new Error("No items in sequence.");
        }
    }

    public each(action: IAction<TIn>): void {
        this.iterate(item => {
            action(item);
            return new IterationResult(null, false);
        });
    }

    public select<TOut>(selector: ISelector<TIn, TOut>): IEnumerable<TOut> {
        return this.iterate(item => {
            var select = selector(item);
            return new IterationResult(select, false);
        });
    }

    public aggregate(aggFunc: IAggFunc<TIn>): TIn {
        return this.aggregateIterate(aggFunc);
    }

    constructor(arr?: TIn[]) {
        if (arr) {
            this.storage = arr;
        } else {
            this.storage = new Array<TIn>();
        }
    }

}

interface IEnumerator<TIn> {
    current: TIn;
    next: ()=> TIn;
    reset: ()=> void;
}

class ArrayEnumerator<TIn> implements IEnumerator<TIn> {

    private currentIndex: number;
    private accessor: (index: number)=> TIn;

    get current(): TIn {
        return this.accessor(this.currentIndex);
    }

    public next(): TIn {
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

    constructor(accessor: (index: number)=> TIn) {
        this.currentIndex = 0;
        this.accessor = accessor;
    }

}

interface IList<TIn> {
    count: number;
    add: (item:TIn)=> void;
    get: (index: number)=> TIn;
    remove: (index: number)=> void;
}