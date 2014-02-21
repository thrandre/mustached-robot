/// <reference path="linq.d.ts"/>

export class EnumerableFactory implements ILinq.IEnumerableFactory {
    public fromArray<T>(arr: T[]): ILinq.IEnumerable<T> {
        return Enumerable.fromArray(arr);
    }

    public fromObject<TVal>(obj: { [id: string]: TVal }): ILinq.IEnumerable<ILinq.IKeyValuePair<string, TVal>> {
        return Enumerable.fromObject(obj);
    }
}

export class Enumerable {
    static fromArray<T>(arr: T[]): ILinq.IEnumerable<T> {
        return new EnumerableCore(arr);
    }
    
    static fromObject<TVal>(obj: { [id: string]: TVal }): ILinq.IEnumerable<ILinq.IKeyValuePair<string, TVal>> {
        var pairs: KeyValuePair<string, TVal>[] = [];
        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                pairs.push(new KeyValuePair(key, obj[key]));
            }
        }
        return new EnumerableCore(pairs);
    }
}
    
export enum SortOrder {
    Ascending,
    Descending
}

class IterationResult<TIn> implements ILinq.IIterationResult<TIn> {
    constructor(public result: TIn, public shouldBreak: boolean) {}
}
    
class FilterAggregator<TIn> implements ILinq.IAggregator<TIn, ILinq.IEnumerable<TIn>> {
    private _storage: TIn[] = [];
        
    public aggregate(item: TIn): void {
        this._storage.push(item);    
    }
        
    public getResult(): ILinq.IEnumerable<TIn> {
        return Enumerable.fromArray(this._storage);
    }
}
    
class AggregationAggregator<TIn, TOut> implements ILinq.IAggregator<TIn, TOut> {
    private _storage: TOut;

    public aggregate(item: TIn): void {
        this._storage = this.aggregatorFunction(this._storage, this.selector(item));
    }
        
    public getResult(): TOut {
        return this._storage;
    }

    constructor(private selector: ILinq.ISelector<TIn, TOut>, private aggregatorFunction: ILinq.IAggregatorFunction<TOut>) {}
}

class GroupingAggregator<TIn, TOut> implements ILinq.IAggregator<TIn, ILinq.IEnumerable<ILinq.IGrouping<TIn, TOut>>> {
    private _storage: Grouping<TIn, TOut>[] = [];

    private bucket(item: TIn): void {
        var key = this.selector(item);
        var bucket = Enumerable.fromArray(this._storage).firstOrDefault(b => b.key === key);

        if (bucket === null || typeof bucket === "undefined") {
            bucket = new Grouping<TIn, TOut>(key);
            this._storage.push(bucket);
        }

        bucket.add(item);
    }

    public aggregate(item: TIn): void {
        this.bucket(item);
    }

    public getResult(): ILinq.IEnumerable<ILinq.IGrouping<TIn, TOut>> {
        return Enumerable.fromArray(this._storage);
    }

    constructor(private selector: ILinq.ISelector<TIn, TOut>) { }
}

class SortingAggregator<TIn, TOut> implements ILinq.IAggregator<TIn, ILinq.IEnumerable<TIn>> {
    private _storage: TIn[] = [];

    private getComparer(): ILinq.IComparerFunction<TOut> {
        return this.sortOrder === SortOrder.Ascending
            ? (i1, i2)=> i1 > i2
            : (i1, i2)=> i2 > i1;
    }

    private getInsertionPosition(item1: TIn): number {
        var comparer = this.getComparer();
        var pos = 0;

        Enumerable.fromArray(this._storage).firstOrDefault(item2=> {
            if (comparer(this.selector(item1), this.selector(item2))) {
                pos++;
                return false;
            }
            return true;
        });

        return pos;
    }

    public aggregate(item: TIn): void {
        this._storage.splice(this.getInsertionPosition(item), 0, item);
    }

    public getResult(): ILinq.IEnumerable<TIn> {
        return Enumerable.fromArray(this._storage);
    }

    constructor(private selector: ILinq.ISelector<TIn, TOut>, private sortOrder: SortOrder) {}
}

class Iterator<TIn> {
    private iterate<TOut, TOut2>(iterator: ILinq.IIteratorKernel<TIn, TOut>, aggregator: ILinq.IAggregator<TOut, TOut2>): TOut2 {
        var i = 0;
        var currentItem: TIn;
    
        while ((currentItem = this.enumerator.next()) !== null) {
            var iteration = iterator(currentItem, i);
    
            if (iteration.result !== null) {
                aggregator.aggregate(iteration.result);
            }
    
            if (iteration.shouldBreak) {
                break;
            }
                
            i++;
        }
    
        return aggregator.getResult();
    }
        
    public filter<TOut, TOut2>(iterator: ILinq.IIteratorKernel<TIn, TOut>, aggregator: ILinq.IAggregator<TOut, TOut2>): TOut2 {
        return this.iterate(iterator, aggregator);
    }
        
    public aggregate<TOut, TOut2>(iterator: ILinq.IIteratorKernel<TIn, TOut>, aggregator: ILinq.IAggregator<TOut, TOut2>): TOut2 {
        return this.iterate(iterator, aggregator);
    }

    constructor(private enumerator: ILinq.IEnumerator<TIn>) { }
}

export class EnumerableCore<TIn> implements ILinq.IEnumerable<TIn> {
    public storage: TIn[];
    
    public getEnumerator(): ILinq.IEnumerator<TIn> {
        return new ArrayEnumerator((i) => this.storage[i]);
    }

    public aggregate<TOut>(selector: ILinq.ISelector<TIn, TOut>, aggFunc: ILinq.IAggregatorFunction<TOut>): TOut {
        return new Iterator(this.getEnumerator()).aggregate(i => new IterationResult(i, false), new AggregationAggregator(selector, aggFunc));
    }

    public iterate<TOut>(iterator: ILinq.IIteratorKernel<TIn, TOut>, aggregator: ILinq.IAggregator<TOut, ILinq.IEnumerable<TOut>>): ILinq.IEnumerable<TOut> {
        return new Iterator(this.getEnumerator()).filter(iterator, aggregator);
    }

    public group<TOut, TOut2>(iterator: ILinq.IIteratorKernel<TIn, TOut>, aggregator: ILinq.IAggregator<TOut, ILinq.IEnumerable<ILinq.IGrouping<TIn, TOut2>>>): ILinq.IEnumerable<ILinq.IGrouping<TIn, TOut2>> {
        return new Iterator(this.getEnumerator()).filter(iterator, aggregator);
    }

    public filter<TOut>(iterator: ILinq.IIteratorKernel<TIn, TOut>): ILinq.IEnumerable<TOut> {
        return this.iterate(iterator, new FilterAggregator<TOut>());
    }

    public sort<TOut>(selector: ILinq.ISelector<TIn, TOut>, order: SortOrder): ILinq.IEnumerable<TIn> {
        return this.iterate(i => new IterationResult(i, false), new SortingAggregator(selector, order));
    }

    public item(index: number): TIn {
        return this.storage[index];
    }
        
    public count(predicate?: ILinq.IPredicate<TIn>): number {
        return predicate ? this.where(predicate).count() : this.storage.length;
    }
    
    public where(predicate: ILinq.IPredicate<TIn>): ILinq.IEnumerable<TIn> {
        return this.filter(item => {
            if (predicate(item)) {
                return new IterationResult(item, false);
            }
            return new IterationResult(null, false);
        });
    }
        
    public firstOrDefault(predicate?: ILinq.IPredicate<TIn>): TIn {
        if (!predicate) {
            return this.item(0);
        }
    
        var result = this.filter((item, i) => {
            if (predicate(item, i)) {
                return new IterationResult(item, true);
            }
            return new IterationResult(null, false);
        });

        return result.count() > 0 ? result.firstOrDefault() : null; // Default-type?
    }
    
    public select<TOut>(selector: ILinq.ISelector<TIn, TOut>): ILinq.IEnumerable<TOut> {
        return this.filter(item => {
            return new IterationResult(selector(item), false);
        });
    }
        
    public orderByAscending<TOut>(selector: ILinq.ISelector<TIn, TOut>): ILinq.IEnumerable<TIn> {
        return this.sort(selector, SortOrder.Ascending);
    }

    public orderByDescending<TOut>(selector: ILinq.ISelector<TIn, TOut>): ILinq.IEnumerable<TIn> {
        return this.sort(selector, SortOrder.Descending);
    }
        
    public aggr<TOut>(selector: ILinq.ISelector<TIn, TOut>, aggFunc: ILinq.IAggregatorFunction<TOut>): TOut {
        return this.aggregate(selector, (sum, next)=> {
            if (typeof sum === "undefined") {
                return next;
            } else {
                return aggFunc(sum, next);
            }
        });
    }

    public sum(selector?: ILinq.ISelector<TIn, number>): number {
        if (!selector) selector = i => <number><any>i;
        return this.aggr(selector, (sum, next) => sum + next);
    }
    
    public groupBy<TOut>(selector: ILinq.ISelector<TIn, TOut>): ILinq.IEnumerable<ILinq.IGrouping<TIn, TOut>> {
        return this.group(i => new IterationResult(i, false), new GroupingAggregator(selector));
    }
     
    public toArray(): TIn[] {
        return this.storage.slice(0);
    }
        
    public toList(): List<TIn> {
        return new List(this.toArray());
    }
        
    constructor(arr?: TIn[]) {
        this.storage = arr ? arr : new Array<TIn>();
    }
}

export class List<TIn> extends EnumerableCore<TIn> implements ILinq.IList<TIn> {
    public add(item: TIn): void {
        this.storage.push(item);
    }

    public remove(index: number): void {
        this.storage.splice(index, 1);
    }

    public each(action: ILinq.IAction<TIn>): void {
        this.filter(item => {
            action(item);
            return new IterationResult(null, false);
        });
    }

    constructor(arr?: TIn[]) {
        super(arr);
    }
}

class Grouping<TIn, TOut> extends List<TIn> implements ILinq.IGrouping<TIn, TOut> {
    constructor(public key: TOut) {
        super();
    }
}

class KeyValuePair<TKey, TVal> implements ILinq.IKeyValuePair<TKey, TVal> {
    constructor(public key: TKey, public value: TVal) {}
}
    
class ArrayEnumerator<TIn> implements ILinq.IEnumerator<TIn> {
    private _currentIndex: number;
    private _accessor: (index: number)=> TIn;
    
    get current(): TIn {
        return this._accessor(this._currentIndex);
    }
    
    public next(): TIn {
        var next = this.current;
    
        if (next) {
            this._currentIndex++;
            return next;
        }
    
        return null;
    }
    
    public reset(): void {
        this._currentIndex = 0;
    }
    
    constructor(accessor: (index: number)=> TIn) {
        this._currentIndex = 0;
        this._accessor = accessor;
    }
}