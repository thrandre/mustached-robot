module Observable {
    export class Property<T> {
        constructor(private property: IProperty<T>, private getter: IGetter<T>) {}
    }

    export interface IGetter<T> {
        (): T;
    }

    export interface IEventArgs {
        event: Event;
        data: any;
    }

    export interface IPropertyChangedEventArgs<T> extends IEventArgs {
        data: IPropertyInfo<T>;
    }

    export interface IPropertyInfo<T> {
        segments: string[];
        path: string;
        getValue(target: any): any;
    }

    export interface ICollectionChangedInfo<T> {
        type: CollectionChangeType;
        item: T;
    }

    export enum Event {
        PropertyChanged,
        CollectionChanged
    }

    export enum CollectionChangeType {
        Add,
        Remove
    }

    export class PropertyInfo<T> implements IPropertyInfo<T> {
        segments: string[] = [];

        get path(): string {
            return this.segments.join(".");
        }

        constructor(property: IProperty<T>) {
            this.segments = this.getPropertySegments(property);
        }

        private getPropertySegments(property: IProperty<T>): string[] {
            return property.toString()
                .replace(/\n|\r|\t|\s{2,}/g, "")
                .match(/function \(\) \{return _this\.(.*?);}/)[1]
                .split(".");
        }

        getValue(target: any): T {
            var accessor = target;
            for (var i in this.segments) {
                accessor = accessor[this.segments[i]];
            }
            return accessor;
        }

        combine(...parts: IPropertyInfo<T>[]): PropertyInfo<T> {
            for (var i in parts) {
                this.segments = this.segments.concat(parts[i].segments);
            }
            return this;
        }

    }

    export class CollectionChangedInfo<T> implements ICollectionChangedInfo<T> {

        constructor(public type: CollectionChangeType, public item: T) {}

    }

    export class EventArgs implements IEventArgs {

        constructor(public event: Event, public data: any) {}

    }

    export class PropertyChangedEventArgs<T> extends EventArgs implements IPropertyChangedEventArgs<T> {

        constructor(data: IPropertyInfo<T>) { super(Event.PropertyChanged, data); }

    }

    export class CollectionChangedEventArgs<T> extends EventArgs {

        constructor(data: ICollectionChangedInfo<T>) { super(Event.CollectionChanged, data); }

    }

    export class Observable {
        private _observerContainer: ObserverContainer;

        notifyObservers(eventArgs: EventArgs) {
            this._observerContainer.notify(this, eventArgs);
        }

        observe(observer: IObserver): Observable {
            this._observerContainer.add(observer);
            return this;
        }

        constructor() {
            this._observerContainer = new ObserverContainer();
        }

    }

    export interface IProperty<T> {
        (): T;
    }

    export interface IObserver {
        (observable: Observable, eventArgs: EventArgs);
    }

    class ObserverContainer {
        private _observers: IObserver[] = [];

        add(observer: IObserver) {
            var idx = this._observers.indexOf(observer);
            if (idx < 0) this._observers.push(observer);
        }

        remove(observer: IObserver) {
            var idx = this._observers.indexOf(observer);
            if (idx > -1) this._observers.splice(idx, 1);
        }

        notify(observable: Observable, eventArgs: EventArgs) {
            for (var i in this._observers)
                this._observers[i](observable, eventArgs);
        }

    }
}