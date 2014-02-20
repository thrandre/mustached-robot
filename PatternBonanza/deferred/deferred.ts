/// <reference path="deferred.d.ts"/>

export class DeferredFactory {
    create<T>(): Deferred.IDeferred<T> {
        return new Deferred<T>();
    }
}

export enum Status {
    Unfulfilled,
    Resolved,
    Rejected
}

export class Rejection implements Deferred.IRejection {
    message: string;
}

export function whenAll(promises: Deferred.IPromise<any>[]): Deferred.IPromise<any[]> {
    return when.apply(this, promises);
}

export function when(...promises: Deferred.IPromise<any>[]): Deferred.IPromise<any[]> {
    var allDone = new Deferred<any[]>();

    if (!promises.length) {
        allDone.resolve([]);
        return allDone.promise();
    }

    var resolved = 0;
    var results = [];

    promises.forEach((p, i) => {
        p
            .done(v => {
                results[i] = v;
                resolved++;
                if (resolved === promises.length && allDone.status !== Status.Rejected) {
                    allDone.resolve(results);
                }
            })
            .fail(e => {
            if (allDone.status !== Status.Rejected) {
                allDone.reject(new Error("when: one or more promises were rejected"));
            }
        });
    });

    return allDone.promise();
}

class Promise<T> implements Deferred.IPromise<T> {
    private _deferred: Deferred<T>;

    constructor(deferred: Deferred<T>) {
        this._deferred = deferred;
    }

    get status(): Status {
        return this._deferred.status;
    }

    get result(): T {
        return this._deferred.result;
    }

    get error(): Rejection {
        return this._deferred.error;
    }

    public done(cb: (v: T) => void): Deferred.IPromise<T> {
        this._deferred.done(cb);
        return this;
    }

    public fail(cb: (v: Rejection) => void): Deferred.IPromise<T> {
        this._deferred.fail(cb);
        return this;
    }

    public then<T2>(cb: (v: T) => any): Deferred.IPromise<T2> {
        return this._deferred.then<T2>(cb);
    }
}

export class Deferred<T> implements Deferred.IDeferred<T> {

    private _promise: Deferred.IPromise<T>;
    private _status: Status = Status.Unfulfilled;
    private _result: T;
    private _error: Rejection;

    private _resolved: (v: T) => void = _ => {};
    private _rejected: (v: Rejection) => void = _=> {};

    constructor() {
        this._promise = new Promise(this);
    }

    public promise(): Deferred.IPromise<T> {
        return this._promise;
    }

    get status(): Status {
        return this._status;
    }

    get result(): T {
        if (this.status !== Status.Resolved) {
            throw new Error("No value present.");
        }
        return this._result;
    }

    get error(): Rejection {
        if (this.status !== Status.Rejected) {
            throw new Error("No error.");
        }
        return this._error;
    }

    public done(cb: (v: T) => void): Deferred.IDeferred<T> {
        if (this.status === Status.Resolved) {
            cb(this.result);
            return this;
        }

        if (this.status !== Status.Unfulfilled) {
            return this;
        }

        var prev = this._resolved;
        this._resolved = v => { prev(v); cb(v); };

        return this;
    }

    public fail(cb: (v: Rejection) => void): Deferred.IDeferred<T> {
        if (this.status === Status.Rejected) {
            cb(this.error);
            return this;
        }

        if (this.status !== Status.Unfulfilled) {
            return this;
        }

        var prev = this._rejected;
        this._rejected = v=> { prev(v); cb(v); };

        return this;
    }

    public then<T2>(cb: (v: T) => T2): Deferred.IPromise<T2> {
        var d = new Deferred<T2>();

        this.done(v => {
            var promiseOrValue = cb(v);

            if (promiseOrValue instanceof Promise) {
                (<any>promiseOrValue).done(v2 => d.resolve(v2)).fail(err => d.reject(err));
                return;
            }

            d.resolve(promiseOrValue);
        })
        .fail(err=> d.reject(err));

        return d.promise();
    }

    public resolve(result: T): Deferred.IDeferred<T> {
        if (this.status !== Status.Unfulfilled) {
            throw new Error("Tried to resolve a fulfilled promise");
        }

        this._result = result;
        this._status = Status.Resolved;
        this._resolved(result);

        this.detach();
        return this;
    }

    public reject(err: Rejection): Deferred.IDeferred<T> {
        if (this.status !== Status.Unfulfilled) {
            throw new Error("Tried to reject a fulfilled promise");
        }

        this._error = err;
        this._status = Status.Rejected;
        this._rejected(err);

        this.detach();
        return this;
    }

    private detach(): void {
        this._resolved = _ => {};
        this._rejected = _ => {};
    }
}