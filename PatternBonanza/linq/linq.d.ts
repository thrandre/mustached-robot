declare module ILinq {
    interface IEnumerableFactory {
        fromArray<T>(arr: T[]): IEnumerable<T>;
        fromObject<TVal>(obj: { [id: string]: TVal }): IEnumerable<IKeyValuePair<string, TVal>>;
    }

    interface IEnumerable<TIn> {
        getEnumerator: () => IEnumerator<TIn>;
        count: (predicate?: IPredicate<TIn>) => number;
        where: (predicate: IPredicate<TIn>) => IEnumerable<TIn>;
        firstOrDefault: (predicate?: IPredicate<TIn>) => TIn;
        select: <TOut>(selector: ISelector<TIn, TOut>) => IEnumerable<TOut>;
        orderByAscending: <TOut>(selector: ISelector<TIn, TOut>) => IEnumerable<TIn>;
        orderByDescending: <TOut>(selector: ISelector<TIn, TOut>) => IEnumerable<TIn>;
        groupBy: <TOut>(selector: ISelector<TIn, TOut>) => IEnumerable<IGrouping<TIn, TOut>>;

        sum: (selector?: ISelector<TIn, number>) => number;

        toArray: () => TIn[];
        toList: () => IList<TIn>;
    }

    interface IPredicate<TIn> {
        (item: TIn, i?: number): boolean;
    }

    interface IAction<TIn> {
        (item: TIn, i?: number);
    }

    interface ISelector<TIn, TOut> {
        (item: TIn, i?: number): TOut;
    }

    interface IAggregatorFunction<TIn> {
        (agg: TIn, next: TIn): TIn;
    }

    interface IComparerFunction<TIn> {
        (item1: TIn, item2: TIn): boolean;
    }

    interface IIteratorKernel<TIn, TOut> {
        (item: TIn, i: number): IIterationResult<TOut>
    }

    interface IIterationResult<TIn> {
        result: TIn;
        shouldBreak: boolean;
    }

    interface IAggregator<TIn, TOut> {
        aggregate(item: TIn);
        getResult(): TOut;
    }

    interface IList<TIn> {
        add: (item: TIn) => void;
        item: (index: number) => TIn;
        remove: (index: number) => void;

        each: (action: IAction<TIn>) => void;
    }

    interface IGrouping<TIn, TOut> extends IEnumerable<TIn> {
        key: TOut;
    }

    interface IKeyValuePair<TKey, TVal> {
        key: TKey;
        value: TVal;
    }

    interface IEnumerator<TIn> {
        current: TIn;
        next: () => TIn;
        reset: () => void;
    }
} 