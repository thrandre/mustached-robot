/// <reference path="linq.d.ts"/>

export class EnumerableFactory implements ILinq.IEnumerableFactory {
    fromArray<T>(arr: T[]): ILinq.IEnumerable<T> {
        return Enumerable.fromArray(arr);
    }

    fromObject<TVal>(obj: { [id: string]: TVal }): ILinq.IEnumerable<ILinq.IKeyValuePair<string, TVal>> {
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
        
    aggregate(item: TIn) {
        this._storage.push(item);    
    }
        
    getResult(): ILinq.IEnumerable<TIn> {
        return Enumerable.fromArray(this._storage);
    }
}
    
class AggregationAggregator<TIn, TOut> implements ILinq.IAggregator<TIn, TOut> {
    private _storage: TOut;

    aggregate(item: TIn) {
        this._storage = this._aggregatorFunction(this._storage, this._selector(item));
    }
        
    getResult(): TOut {
        return this._storage;
    }

    constructor(
        private _selector: ILinq.ISelector<TIn, TOut>,
        private _aggregatorFunction: ILinq.IAggregatorFunction<TOut>) { }
}

class GroupingAggregator<TIn, TOut> implements ILinq.IAggregator<TIn, ILinq.IEnumerable<ILinq.IGrouping<TIn, TOut>>> {
    private _storage: Grouping<TIn, TOut>[] = [];

    private bucket(item: TIn) {
        var key = this._selector(item);
        var bucket = Enumerable.fromArray(this._storage).firstOrDefault(b => b.key === key);

        if (bucket === null || typeof bucket === "undefined") {
            bucket = new Grouping<TIn, TOut>(key);
            this._storage.push(bucket);
        }

        bucket.add(item);
    }

    aggregate(item: TIn) {
        this.bucket(item);
    }

    getResult(): ILinq.IEnumerable<ILinq.IGrouping<TIn, TOut>> {
        return Enumerable.fromArray(this._storage);
    }

    constructor(private _selector: ILinq.ISelector<TIn, TOut>) { }
}

class SortingAggregator<TIn, TOut> implements ILinq.IAggregator<TIn, ILinq.IEnumerable<TIn>> {
    private _storage: TIn[] = [];

    private getComparer(): ILinq.IComparerFunction<TOut> {
        return this._sortOrder === SortOrder.Ascending
            ? (i1, i2)=> i1 > i2
            : (i1, i2)=> i2 > i1;
    }

    private getInsertionPosition(item1: TIn): number {
        var comparer = this.getComparer();
        var pos = 0;

        Enumerable.fromArray(this._storage).firstOrDefault(item2=> {
            if (comparer(this._selector(item1), this._selector(item2))) {
                pos++;
                return false;
            }
            return true;
        });

        return pos;
    }

    aggregate(item: TIn) {
        this._storage.splice(this.getInsertionPosition(item), 0, item);
    }

    getResult(): ILinq.IEnumerable<TIn> {
        return Enumerable.fromArray(this._storage);
    }

    constructor(
        private _selector: ILinq.ISelector<TIn, TOut>,
        private _sortOrder: SortOrder) { }
}

class Iterator<TIn> {
    private iterate<TOut, TOut2>(iterator: ILinq.IIteratorKernel<TIn, TOut>, aggregator: ILinq.IAggregator<TOut, TOut2>): TOut2 {
        var i = 0;
        var currentItem: TIn;
    
        while ((currentItem = this._enumerator.next()) !== null) {
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
        
    filter<TOut, TOut2>(iterator: ILinq.IIteratorKernel<TIn, TOut>, aggregator: ILinq.IAggregator<TOut, TOut2>): TOut2 {
        return this.iterate(iterator, aggregator);
    }
        
    aggregate<TOut, TOut2>(iterator: ILinq.IIteratorKernel<TIn, TOut>, aggregator: ILinq.IAggregator<TOut, TOut2>): TOut2 {
        return this.iterate(iterator, aggregator);
    }

    constructor(private _enumerator: ILinq.IEnumerator<TIn>) { }
}

export class EnumerableCore<TIn> implements ILinq.IEnumerable<TIn> {
    storage: TIn[];
    
    getEnumerator(): ILinq.IEnumerator<TIn> {
        return new ArrayEnumerator((i) => this.storage[i]);
    }

    aggregate<TOut>(selector: ILinq.ISelector<TIn, TOut>, aggFunc: ILinq.IAggregatorFunction<TOut>): TOut {
        return new Iterator(this.getEnumerator()).aggregate(i => new IterationResult(i, false), new AggregationAggregator(selector, aggFunc));
    }

    iterate<TOut>(iterator: ILinq.IIteratorKernel<TIn, TOut>, aggregator: ILinq.IAggregator<TOut, ILinq.IEnumerable<TOut>>): ILinq.IEnumerable<TOut> {
        return new Iterator(this.getEnumerator()).filter(iterator, aggregator);
    }

    group<TOut, TOut2>(iterator: ILinq.IIteratorKernel<TIn, TOut>, aggregator: ILinq.IAggregator<TOut, ILinq.IEnumerable<ILinq.IGrouping<TIn, TOut2>>>): ILinq.IEnumerable<ILinq.IGrouping<TIn, TOut2>> {
        return new Iterator(this.getEnumerator()).filter(iterator, aggregator);
    }

    filter<TOut>(iterator: ILinq.IIteratorKernel<TIn, TOut>): ILinq.IEnumerable<TOut> {
        return this.iterate(iterator, new FilterAggregator<TOut>());
    }

    sort<TOut>(selector: ILinq.ISelector<TIn, TOut>, order: SortOrder): ILinq.IEnumerable<TIn> {
        return this.iterate(i => new IterationResult(i, false), new SortingAggregator(selector, order));
    }

    item(index: number): TIn {
        return this.storage[index];
    }
        
    count(predicate?: ILinq.IPredicate<TIn>): number {
        return predicate ? this.where(predicate).count() : this.storage.length;
    }
    
    where(predicate: ILinq.IPredicate<TIn>): ILinq.IEnumerable<TIn> {
        return this.filter(item => {
            if (predicate(item)) {
                return new IterationResult(item, false);
            }
            return new IterationResult(null, false);
        });
    }
        
    firstOrDefault(predicate?: ILinq.IPredicate<TIn>): TIn {
        if (!predicate) {
            return this.item(0);
        }
    
        var result = this.filter((item, i) => {
            if (predicate(item, i)) {
                return new IterationResult(item, true);
            }
            return new IterationResult(null, false);
        });

        return result.count() > 0 ? result.firstOrDefault() : null;
    }
    
    select<TOut>(selector: ILinq.ISelector<TIn, TOut>): ILinq.IEnumerable<TOut> {
        return this.filter(item => {
            return new IterationResult(selector(item), false);
        });
    }
        
    orderByAscending<TOut>(selector: ILinq.ISelector<TIn, TOut>): ILinq.IEnumerable<TIn> {
        return this.sort(selector, SortOrder.Ascending);
    }

    orderByDescending<TOut>(selector: ILinq.ISelector<TIn, TOut>): ILinq.IEnumerable<TIn> {
        return this.sort(selector, SortOrder.Descending);
    }
        
    aggr<TOut>(selector: ILinq.ISelector<TIn, TOut>, aggFunc: ILinq.IAggregatorFunction<TOut>): TOut {
        return this.aggregate(selector, (sum, next)=> {
            return typeof sum === "undefined" ? next : aggFunc(sum, next);
        });
    }

    sum(selector?: ILinq.ISelector<TIn, number>): number {
        if (!selector) selector = i => <number><any>i;
        return this.aggr(selector, (sum, next) => sum + next);
    }
    
    groupBy<TOut>(selector: ILinq.ISelector<TIn, TOut>): ILinq.IEnumerable<ILinq.IGrouping<TIn, TOut>> {
        return this.group(i => new IterationResult(i, false), new GroupingAggregator(selector));
    }
     
    toArray(): TIn[] {
        return this.storage.slice(0);
    }
        
    toList(): List<TIn> {
        return new List(this.toArray());
    }
        
    constructor(arr?: TIn[]) {
        this.storage = arr ? arr : new Array<TIn>();
    }
}

export class List<TIn> extends EnumerableCore<TIn> implements ILinq.IList<TIn> {
    add(item: TIn) {
        this.storage.push(item);
    }

    remove(index: number) {
        this.storage.splice(index, 1);
    }

    each(action: ILinq.IAction<TIn>) {
        this.filter(item => {
            action(item);
            return new IterationResult(null, false);
        });
    }

    constructor(arr?: TIn[]) { super(arr); }
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
    private _currentIndex: number = 0;
    
    get current(): TIn {
        return this._accessor(this._currentIndex);
    }
    
    next(): TIn {
        var next = this.current;
    
        if (next) {
            this._currentIndex++;
            return next;
        }
    
        return null;
    }
    
    reset() {
        this._currentIndex = 0;
    }
    
    constructor(private _accessor: (index: number)=> TIn) {}
}