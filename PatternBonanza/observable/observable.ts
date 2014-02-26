export interface IPropertyInfo {
    path: string;
    pathSegment(i: number): string;
    value: any;
}

export class PropertyInfo implements IPropertyInfo {
    private _steps: string[] = [];

    get value(): any {
        var accessor = this.root;
        for (var i in this._steps)
            accessor = accessor[this._steps[i]];

        return accessor;
    }

    get path(): string {
        return this._steps.join(".");
    }

    constructor(private root: any) { }

    private getLastTraversalStep(property: IProperty): string {
        var segments = property.toString()
            .replace(/\n|\r|\t|\s{2,}/g, "")
            .match(/function \(\) \{return _this\.(.*?);}/)[1]
            .split(".");

        return segments[segments.length - 1];
    }

    pathSegment(i: number): string {
        return this._steps[i];
    }

    addStep(property: IProperty): PropertyInfo {
        this._steps.push(this.getLastTraversalStep(property));
        return this;
    }

    combine(parts: IPropertyInfo[]): PropertyInfo {
        for (var i in parts)
            this._steps.push(parts[i].path);

        return this;
    }
}

export class Observable {
    private _observerContainer: ObserverContainer;

    notifyObservers(property: IProperty, nestedProperties?: IPropertyInfo[]) {
        nestedProperties = nestedProperties || [];
        this._observerContainer.notify(this,
            new PropertyInfo(this).addStep(property).combine(nestedProperties));
    }

    observe(observer: IObserver): Observable {
        this._observerContainer.add(observer);
        return this;
    }

    constructor() {
        this._observerContainer = new ObserverContainer();
    }
}

export interface IProperty {
    (): any;
}

export interface IObserver {
    (observable: Observable, property: IPropertyInfo);
}

class ObserverContainer {
    private _observers: IObserver[] = [];

    add(observer: IObserver) {
        var idx = this._observers.indexOf(observer);
        if(idx < 0) this._observers.push(observer);
    }

    remove(observer: IObserver) {
        var idx = this._observers.indexOf(observer);
        if (idx > -1) this._observers.splice(idx, 1);
    }

    notify(observable: Observable, property: IPropertyInfo) {
        for (var i in this._observers)
            this._observers[i](observable, property);
    }
}