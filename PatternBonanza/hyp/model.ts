export class ConventionBase extends Observable.Observable {
    private getClassName(): string {
        return this.constructor
            .toString()
            .match(/function (.*?)\(/)[1];
    }

    getEntityName(): string {
        return this.getClassName()
            .replace(/model|collection|viewmodel/i, "");
    }
}

export class Model<T> extends ConventionBase {
    id: string;
    collection: Collection<T>;

    getUrl(): string {
        return "";
    }

    serialize(model: T): string {
        return "";
    }

    deserialize(serialized: string): T {
        return null;
    }
}

export class Collection<T> extends ConventionBase implements Linq.IList<T> {
    models: Linq.IList<T> = new Linq.List<T>();

    item(index: number): T {
        return this.models.item(index);
    }

    add(model: T) {
        this.models.add(model);
        this.notifyObservers(
            new Observable.CollectionChangedEventArgs(
                new Observable.CollectionChangedInfo(Observable.CollectionChangeType.Add, model)));
    }

    remove(index: number) {
        this.models.remove(index);
        this.notifyObservers(
            new Observable.CollectionChangedEventArgs(
                new Observable.CollectionChangedInfo(Observable.CollectionChangeType.Remove, null)));
    }

    each(action: Linq.IAction<T>) {
        return this.models.each(action);
    }

    getEnumerator(): Linq.IEnumerator<T> {
        return this.models.getEnumerator();
    }

    count(predicate?: Linq.IPredicate<T>): number {
        return this.models.count(predicate);
    }

    where(predicate: Linq.IPredicate<T>): Linq.IEnumerable<T> {
        return this.models.where(predicate);
    }

    firstOrDefault(predicate?: Linq.IPredicate<T>): T {
        return this.models.firstOrDefault(predicate);
    }

    select<TOut>(selector: Linq.ISelector<T, TOut>): Linq.IEnumerable<TOut> {
        return this.models.select(selector);
    }

    orderByAscending<TOut>(selector: Linq.ISelector<T, TOut>): Linq.IEnumerable<T> {
        return this.models.orderByAscending(selector);
    }

    orderByDescending<TOut>(selector: Linq.ISelector<T, TOut>): Linq.IEnumerable<T> {
        return this.models.orderByDescending(selector);
    }

    groupBy<TOut>(selector: Linq.ISelector<T, TOut>): Linq.IEnumerable<Linq.IGrouping<T, TOut>> {
        return this.models.groupBy(selector);
    }

    sum(selector?: Linq.ISelector<T, number>): number {
        return this.models.sum(selector);
    }

    toArray(): T[] {
        return this.models.toArray();
    }

    toList(): Linq.IList<T> {
        return this.models.toList();
    }
}

export class UserModel extends Model<UserModel> { }
export class UserCollection extends Collection<UserModel> { }