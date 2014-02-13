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
        each: (action: IAction<TIn>) => void;
        select: <TOut>(selector: ISelector<TIn, TOut>) => IEnumerable<TOut>;
        orderByAscending: (sortFunction: ISortFunction<TIn>) => IEnumerable<TIn>;
        aggregate: (aggregator: IAggregatorFunction<TIn>) => TIn;
        
        toArray: () => TIn[];
        toList: () => Linq.Collections.List<TIn>;
    }
    
    export interface IPredicate<TIn> {
        (item: TIn, i?: number): boolean;
    }
    
    export interface IAction<TIn> {
        (item: TIn): void;
    };
    
    export interface ISelector<TIn, TOut> {
        (item: TIn): TOut;
    }
    
    export interface IAggregatorFunction<TIn> {
        (agg: TIn, next: TIn): TIn;
    }
    
    export interface ISortFunction<TIn> {
        (item1: TIn, item2: TIn): number;
    }
    
    interface IIteratorKernel<TIn, TOut> {
        (item: TIn, i: number): IterationResult<TOut>
    }
    
    class IterationResult<TIn> {
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
    
    class AggregationAggregator<TIn> implements IAggregator<TIn, TIn> {
        public aggregate(item: TIn): void {
              
        }
        
        public getResult(): TIn {
            return null;
        }
    }
    
    class SortingAggregator<TIn> implements IAggregator<TIn, IEnumerable<TIn>> {
        private storage: TIn[] = [];
        
        private getInsertionPosition(item: TIn): number {
            var pos = 0;
            new Enumerable(this.storage).firstOrDefault((item2, i?) => {
                if(this.sortFunc(item, item2) > -1) {
                    pos = i-1 < 0 ? 0 : i-1;
                    return true;
                }
                return false;
            });
            
            return pos;
        }
        
        public aggregate(item: TIn): void {
            var pos = 
            this.storage.splice(, 0, item);
        }
        
        public getResult(): IEnumerable<TIn> {
            return new Enumerable(this.storage);
        }
        
        constructor(private sortFunc: ISortFunction<TIn>) {}
    }
    
    class Iterator<TIn> {
        constructor(private enumerator: IEnumerator<TIn>) {}
        
        private iterate<TOut, TOut2>(iterator: IIteratorKernel<TIn, TOut>, aggregator: IAggregator<TOut, TOut2>): TOut2 {
            var i: number = 0;
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
        
        public aggregate<TOut>(iterator: IIteratorKernel<TIn, TOut>, aggregator: IAggregator<TOut, TOut>): TOut {
            return this.iterate(iterator, aggregator);
        }
    }
    
    export class Enumerable<TIn> implements IEnumerable<TIn> {
        public storage: TIn[];
    
        public getEnumerator(): IEnumerator<TIn> {
            return new ArrayEnumerator((i) => this.storage[i]);
        }
        
        private performFiltering<TOut>(iterator: IIteratorKernel<TIn, TOut>, aggregator: IAggregator<TOut, IEnumerable<TOut>>): IEnumerable<TOut> {
            return new Iterator(this.getEnumerator()).filter(iterator, aggregator);
        }
        
        private performAggregation(iterator: IIteratorKernel<TIn, TIn>, aggregator: IAggregator<TIn, TIn>): TIn {
            return new Iterator(this.getEnumerator()).aggregate(i => new IterationResult(i, false), aggregator);
        } 
        
        private filter<TOut>(iterator: IIteratorKernel<TIn, TOut>): IEnumerable<TOut> {
            return this.performFiltering(iterator, new FilterAggregator<TOut>());
        }
        
        private sort(sortFunction: ISortFunction<TIn>): IEnumerable<TIn> {
            return this.performFiltering(i => new IterationResult(i, false), new SortingAggregator(sortFunction));
        }
        
        public item(index: number): TIn {
            return this.storage[index];
        }
        
        public count(predicate?: IPredicate<TIn>): number {
            if (!predicate) {
                return this.storage.length;
            }
    
            return this.where(predicate).count();
        }
    
        public where(predicate: IPredicate<TIn>): IEnumerable<TIn> {
            return this.filter(item => {
                if (predicate(item)) {
                    return new IterationResult(item, false);
                } else {
                    return new IterationResult(null, false);
                }
            });
        }
        
        public firstOrDefault(predicate?: IPredicate<TIn>): TIn {
            if (!predicate) {
                return this.item(0);
            }
    
            var result = this.filter((item, i) => {
                if (predicate(item, i)) {
                    return new IterationResult(item, true);
                } else {
                    return new IterationResult(null, false);
                }
            });
            
            if (result.count() > 0) {
                return result.firstOrDefault();
            } else {
                return null; //TODO: Default verdi for type
            }
        }
    
        public each(action: IAction<TIn>): void {
            this.filter(item => {
                action(item);
                return new IterationResult(null, false);
            });
        }
    
        public select<TOut>(selector: ISelector<TIn, TOut>): IEnumerable<TOut> {
            return this.filter(item => {
                return new IterationResult(selector(item), false);
            });
        }
        
        public orderByAscending(sortFunction: ISortFunction<TIn>): IEnumerable<TIn> {
            return this.sort(sortFunction);
        }
        
        public aggregate(aggFunc: IAggregatorFunction<TIn>): TIn {
            return null;//this.aggregateFilter(aggFunc);
        }
        
        public toArray(): TIn[] {
            return this.storage.slice(0);
        }
        
        public toList(): Linq.Collections.List<TIn> {
            return new Linq.Collections.List(this.toArray());
        }
        
        constructor(arr?: TIn[]) {
            if (arr) {
                this.storage = arr;
            } else {
                this.storage = new Array<TIn>();
            }
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

module Linq.Collections {
    export interface IList<TIn> {
        add: (item:TIn) => void;
        item: (index: number) => TIn;
        remove: (index: number) => void;
    }
    
    export class List<TIn> extends Linq.Core.Enumerable<TIn> implements IList<TIn> {
        public add(item: TIn): void {
            this.storage.push(item);
        }
        
        public remove(index: number): void {
            this.storage.splice(index, 1);
        }
    }
}