/// <reference path="common.ts"/>

class Enumerable {
    static fromArray<T>(arr: T[]): Linq.Core.IEnumerable<T> {
        return new Linq.Core.Enumerable(arr);
    }
    
    static fromObject<TVal>(obj: { [id: string]: TVal} ): Linq.Core.IEnumerable<Linq.Core.KeyValuePair<string, TVal>> {
        var pairs: Linq.Core.KeyValuePair<string, TVal>[] = [];
        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                pairs.push(new Linq.Core.KeyValuePair(key, obj[key]));
            }
        }
        return new Linq.Core.Enumerable(pairs);
    }
}

module Linq.Core {
    export interface IEnumerable<TIn> {
        getEnumerator: ()=> IEnumerator<TIn>;
        count: (predicate?: IPredicate<TIn>) => number;
        where: (predicate: IPredicate<TIn>) => IEnumerable<TIn>;
        firstOrDefault: (predicate?: IPredicate<TIn>) => TIn;
        select: <TOut>(selector: ISelector<TIn, TOut>) => IEnumerable<TOut>;
        orderByAscending: <TOut>(selector: ISelector<TIn, TOut>) => IEnumerable<TIn>;
        orderByDescending: <TOut>(selector: ISelector<TIn, TOut>) => IEnumerable<TIn>;
        groupBy: <TOut>(selector: ISelector<TIn, TOut>) => IEnumerable<Grouping<TIn, TOut>>;
        
        sum: (selector: ISelector<TIn, number>) => number;

        toArray: () => TIn[];
        toList: () => List<TIn>;
    }
    
    export interface IPredicate<TIn> {
        (item: TIn, i?: number): boolean;
    }
    
    export interface IAction<TIn> {
        (item: TIn, i?: number): void;
    };
    
    export interface ISelector<TIn, TOut> {
        (item: TIn, i?: number): TOut;
    }
    
    export interface IAggregatorFunction<TIn> {
        (agg: TIn, next: TIn): TIn;
    }
    
    export interface IComparerFunction<TIn> {
        (item1: TIn, item2: TIn): boolean;
    }
    
    export interface IIteratorKernel<TIn, TOut> {
        (item: TIn, i: number): IterationResult<TOut>
    }
    
    export enum SortOrder {
        Ascending,
        Descending
    }

    export class IterationResult<TIn> {
        constructor(public result: TIn, public shouldBreak: boolean) {}
    }
    
    interface IAggregator<TIn, TOut> {
        aggregate(item: TIn): void;
        getResult(): TOut;
    }
    
    class FilterAggregator<TIn> implements IAggregator<TIn, IEnumerable<TIn>> {
        private storage: TIn[] = [];
        
        public aggregate(item: TIn): void {
            this.storage.push(item);    
        }
        
        public getResult(): IEnumerable<TIn> {
            return new Enumerable(this.storage);
        }
    }
    
    class AggregationAggregator<TIn, TOut> implements IAggregator<TIn, TOut> {
        private storage: TOut;

        public aggregate(item: TIn): void {
            this.storage = this.aggregatorFunction(this.storage, this.selector(item));
        }
        
        public getResult(): TOut {
            return this.storage;
        }

        constructor(private selector: ISelector<TIn, TOut>, private aggregatorFunction: IAggregatorFunction<TOut>) {}
    }

    class GroupingAggregator<TIn, TOut> implements IAggregator<TIn, IEnumerable<Grouping<TIn, TOut>>> {
        private storage: Grouping<TIn, TOut>[] = [];

        private bucket(item: TIn): void {
            var key = this.selector(item);
            var bucket = new Enumerable(this.storage).firstOrDefault(b => b.key === key);

            if (bucket === null || typeof bucket === "undefined") {
                bucket = new Grouping<TIn, TOut>(key);
                this.storage.push(bucket);
            }

            bucket.add(item);
        }

        public aggregate(item: TIn): void {
            this.bucket(item);
        }

        public getResult(): IEnumerable<Grouping<TIn, TOut>> {
            return new Enumerable(this.storage);
        }

        constructor(private selector: ISelector<TIn, TOut>) { }
    }

    class SortingAggregator<TIn, TOut> implements IAggregator<TIn, IEnumerable<TIn>> {
        private storage: TIn[] = [];

        private getComparer(): IComparerFunction<TOut> {
            return this.sortOrder === SortOrder.Ascending
                ? (i1, i2)=> i1 > i2
                : (i1, i2)=> i2 > i1;
        }

        private getInsertionPosition(item1: TIn): number {
            var comparer = this.getComparer();
            var pos = 0;

            new Enumerable(this.storage).firstOrDefault(item2=> {
                if (comparer(this.selector(item1), this.selector(item2))) {
                    pos++;
                    return false;
                }
                return true;
            });

            return pos;
        }

        public aggregate(item: TIn): void {
            this.storage.splice(this.getInsertionPosition(item), 0, item);
        }

        public getResult(): IEnumerable<TIn> {
            return new Enumerable(this.storage);
        }

        constructor(private selector: ISelector<TIn, TOut>, private sortOrder: SortOrder) {}
    }

    class Iterator<TIn> {
        private iterate<TOut, TOut2>(iterator: IIteratorKernel<TIn, TOut>, aggregator: IAggregator<TOut, TOut2>): TOut2 {
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
        
        public filter<TOut, TOut2>(iterator: IIteratorKernel<TIn, TOut>, aggregator: IAggregator<TOut, TOut2>): TOut2 {
            return this.iterate(iterator, aggregator);
        }
        
        public aggregate<TOut, TOut2>(iterator: IIteratorKernel<TIn, TOut>, aggregator: IAggregator<TOut, TOut2>): TOut2 {
            return this.iterate(iterator, aggregator);
        }

        constructor(private enumerator: IEnumerator<TIn>) { }
    }
    
    export class Enumerable<TIn> implements IEnumerable<TIn> {
        public storage: TIn[];
    
        public getEnumerator(): IEnumerator<TIn> {
            return new ArrayEnumerator((i) => this.storage[i]);
        }
        
        private aggregate<TOut>(selector: ISelector<TIn, TOut>, aggFunc: IAggregatorFunction<TOut>): TOut {
            return new Iterator(this.getEnumerator()).aggregate(i => new IterationResult(i, false), new AggregationAggregator(selector, aggFunc));
        }

        private iterate<TOut>(iterator: IIteratorKernel<TIn, TOut>, aggregator: IAggregator<TOut, IEnumerable<TOut>>): IEnumerable<TOut> {
            return new Iterator(this.getEnumerator()).filter(iterator, aggregator);
        }

        private group<TOut, TOut2>(iterator: IIteratorKernel<TIn, TOut>, aggregator: IAggregator<TOut, IEnumerable<Grouping<TIn,TOut2>>>): IEnumerable<Grouping<TIn,TOut2>> {
            return new Iterator(this.getEnumerator()).filter(iterator, aggregator);
        }

        public filter<TOut>(iterator: IIteratorKernel<TIn, TOut>): IEnumerable<TOut> {
            return this.iterate(iterator, new FilterAggregator<TOut>());
        }
        
        public sort<TOut>(selector: ISelector<TIn, TOut>, order: SortOrder): IEnumerable<TIn> {
            return this.iterate(i => new IterationResult(i, false), new SortingAggregator(selector, order));
        }

        public groupBy<TOut>(selector: ISelector<TIn, TOut>): IEnumerable<Grouping<TIn, TOut>> {
            return this.group(i => new IterationResult(i, false), new GroupingAggregator(selector));
        }
        
        public item(index: number): TIn {
            return this.storage[index];
        }
        
        public count(predicate?: IPredicate<TIn>): number {
            return predicate ? this.where(predicate).count() : this.storage.length;
        }
    
        public where(predicate: IPredicate<TIn>): IEnumerable<TIn> {
            return this.filter(item => {
                if (predicate(item)) {
                    return new IterationResult(item, false);
                }
                return new IterationResult(null, false);
            });
        }
        
        public firstOrDefault(predicate?: IPredicate<TIn>): TIn {
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
    
        public select<TOut>(selector: ISelector<TIn, TOut>): IEnumerable<TOut> {
            return this.filter(item => {
                return new IterationResult(selector(item), false);
            });
        }
        
        public orderByAscending<TOut>(selector: ISelector<TIn, TOut>): IEnumerable<TIn> {
            return this.sort(selector, SortOrder.Ascending);
        }

        public orderByDescending<TOut>(selector: ISelector<TIn, TOut>): IEnumerable<TIn> {
            return this.sort(selector, SortOrder.Descending);
        }
        
        public aggr<TOut>(selector: ISelector<TIn, TOut>, aggFunc: IAggregatorFunction<TOut>): TOut {
            return this.aggregate(selector, (sum, next)=> {
                if (typeof sum === "undefined") {
                    return next;
                } else {
                    return aggFunc(sum, next);
                }
            });
        }

        public sum(selector: ISelector<TIn, number>): number {
            return this.aggr(selector, (sum, next) => sum + next);
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
    
    export interface IList<TIn> {
        add: (item: TIn) => void;
        item: (index: number) => TIn;
        remove: (index: number) => void;

        each: (action: Linq.Core.IAction<TIn>) => void;
    }

    export class List<TIn> extends Linq.Core.Enumerable<TIn> implements IList<TIn> {
        public add(item: TIn): void {
            this.storage.push(item);
        }

        public remove(index: number): void {
            this.storage.splice(index, 1);
        }

        public each(action: Linq.Core.IAction<TIn>): void {
            this.filter(item => {
                action(item);
                return new Linq.Core.IterationResult(null, false);
            });
        }
    }    

    export class Grouping<TIn, TOut> extends List<TIn> {
        constructor(public key: TOut) {
            super();
        }
    }

    export class KeyValuePair<TKey, TVal> {
        constructor(public key: TKey, public value: TVal) {}
    }
    
    export interface IEnumerator<TIn> {
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
    
        public reset(): void {
            this.currentIndex = 0;
        }
    
        constructor(accessor: (index: number)=> TIn) {
            this.currentIndex = 0;
            this.accessor = accessor;
        }
    }
}