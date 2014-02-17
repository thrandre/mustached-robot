interface IDeferred<T> {
    promise(): IPromise<T>;

    resolve(v: T): IDeferred<T>;
    reject(r: Rejection): IDeferred<T>;

    done(cb: (v: T) => void): IDeferred<T>;
    fail(cb: (r: Rejection) => void): IDeferred<T>;
}

class Rejection {
    message: string;
}

enum Status {
    Unfulfilled,
    Resolved,
    Rejected
}

interface IPromise<T> {
    status: Status;
    result: T;
    error: Rejection;

    done(cb: (v: T) => void): IPromise<T>;
    fail(cb: (r: Rejection) => void): IPromise<T>;

    thenz<T2>(): IPromise<T2>;
}

class Promise<T> implements IPromise<T> {
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

    public done(cb: (v: T) => void): IPromise<T> {
        this._deferred.done(cb);
        return this;
    }

    public fail(cb: (v: Rejection) => void): IPromise<T> {
        this._deferred.fail(cb);
        return this;
    }

    public thenz<T2>(): IPromise<T2> {
        return null;
    }
}

class Deferred<T> implements IDeferred<T> {

    private _promise: IPromise<T>;
    private _status: Status = Status.Unfulfilled;
    private _result: T;
    private _error: Rejection;

    private _resolved: (v: T) => void = _ => { };
    private _rejected: (v: Rejection) => void = _=> { };

    constructor() {
        this._promise = new Promise(this);
    }

    public promise(): IPromise<T> {
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

    public done(cb: (v: T) => void): IDeferred<T> {
        if (this.status === Status.Resolved) {
            cb(this.result);
            return this;
        }

        if (this.status !== Status.Unfulfilled) {
            return this;
        }

        var prev = this._resolved;
        this._resolved = v=> { prev(v); cb(v); };

        return this;
    }

    public fail(cb: (v: Rejection) => void): IDeferred<T> {
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

    public then<T2>(cb: (v: T) => any): IPromise<T2> {
        var d = new Deferred<T2>();

        this.done(v=> {
            var promiseOrValue = cb(v);
            if (promiseOrValue instanceof Promise) {
                var promise = <IPromise<T2>> promiseOrValue;
                promise.done(v2=> d.resolve(v2))
                    .fail(err=> d.reject(err));
                return promise;
            }

            d.resolve(promiseOrValue);
        })
            .fail(err=> d.reject(err));

        return d.promise();
    }

    public resolve(result: T): IDeferred<T> {
        if (this.status !== Status.Unfulfilled) {
            throw new Error("Tried to resolve a fulfilled promise");
        }

        this._result = result;
        this._status = Status.Resolved;
        this._resolved(result);

        this.detach();
        return this;
    }

    public reject(err: Rejection): IDeferred<T> {
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
        this._resolved = _ => { };
        this._rejected = _ => { };
    }
}