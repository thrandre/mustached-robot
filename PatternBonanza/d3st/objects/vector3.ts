///<reference path="../../observable/observable.ts"/>

module D3ST.Objects {
    export class Vector3 extends Observable.Observable {
        constructor(private _wrapped: Wrappers.IWrappedVector3) { super(); }

        get x(): number {
            return this._wrapped.x;
        }
        set x(value: number) {
            this._wrapped.x = value;
            this.notifyObservers(
                new Observable.PropertyChangedEventArgs(
                    new Observable.PropertyInfo(() => this.x)));
        }

        get y(): number {
            return this._wrapped.y;
        }
        set y(value: number) {
            this._wrapped.y = value;
            this.notifyObservers(
                new Observable.PropertyChangedEventArgs(
                    new Observable.PropertyInfo(() => this.y)));
        }

        get z(): number {
            return this._wrapped.z;
        }
        set z(value: number) {
            this._wrapped.z = value;
            this.notifyObservers(
                new Observable.PropertyChangedEventArgs(
                    new Observable.PropertyInfo(() => this.y)));
        }

        setFrom(vector: Vector3) {
            this.x = vector.x;
            this.y = vector.y;
            this.z = vector.z;
        }

        asThreeVector(): Wrappers.IWrappedVector3 {
            return this._wrapped;
        }
    } 
} 