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
        aggregate: (aggregator: IAggregatorFunction<TIn>) => TIn;
    }
    
    export interface IPredicate<TIn> {
        (item: TIn): boolean;
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
    
    interface IIteratorKernel<TIn, TOut> {
        (item: TIn): IterationResult<TOut>
    }
    
    interface IAggregatorKernel<TIn> {
        (storage: TIn[], item: TIn): void;
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
    
    class Aggregator<TIn> {
        private storage: TIn[] = [];
    
        public aggregate(item: TIn): void {
            this.aggregatorKernel(this.storage, item);
        }
    
        public aggregationResult(): IEnumerable<TIn> {
            return new Enumerable(this.storage);
        }
    
        constructor(private aggregatorKernel: IAggregatorKernel<TIn>) {}
    }
    
    class Iterator<TIn> {
        constructor(private enumerator: IEnumerator<TIn>) {}
        
        private iterate<TOut, TOut2>(iterator: IIteratorKernel<TIn, TOut>, aggregator: IAggregator<TOut, TOut2>): TOut2 {
            var currentItem: TIn;
    
            while ((currentItem = this.enumerator.next()) !== null) {
                var iteration = iterator(currentItem);
    
                if (iteration.result !== null) {
                    aggregator.aggregate(iteration.result);
                }
    
                if (iteration.shouldBreak) {
                    break;
                }
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
        
        private filter<TOut>(iterator: IIteratorKernel<TIn, TOut>): IEnumerable<TOut> {
            return new Iterator(this.getEnumerator()).filter(iterator, new FilterAggregator<TOut>());
        }
        
        private aggregateFilter(aggregator: IAggregator<TIn, TIn>): TIn {
            return new Iterator(this.getEnumerator()).aggregate(i => new IterationResult(i, false), aggregator);
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
    
            var result = this.filter(item => {
                if (predicate(item)) {
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
    
        public aggregate(aggFunc: IAggregatorFunction<TIn>): TIn {
            return null;//this.aggregateFilter(aggFunc);
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
    
    interface IList<TIn> {
        count: number;
        add: (item:TIn)=> void;
        get: (index: number)=> TIn;
        remove: (index: number)=> void;
    }
    
}