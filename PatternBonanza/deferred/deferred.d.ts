declare module IDeferred {

    interface IRejection {
        message: string;
    }

    interface IDeferredFactory {
        create<T>(): IDeferred<T>;
        utils: IDeferredUtils;
    }

    interface IDeferredUtils {
        when(...promises: IDeferred.IPromise<any>[]): IDeferred.IPromise<any[]>;
        whenAll(promises: IDeferred.IPromise<any>[]): IDeferred.IPromise<any[]>;
    }

    interface IDeferred<T> {
        promise(): IPromise<T>;

        resolve(v: T): IDeferred<T>;
        reject(r: IRejection): IDeferred<T>;

        done(cb: (v: T)=> void): IDeferred<T>;
        fail(cb: (r: IRejection)=> void): IDeferred<T>;
    }

    interface IPromise<T> {
        status: number;
        result: T;
        error: IRejection;

        done(cb: (v: T)=> void): IPromise<T>;
        fail(cb: (r: IRejection)=> void): IPromise<T>;

        then<T2>(cb: (v: T)=> T2): IPromise<T2>;
        then<T2>(cb: (v: T)=> IPromise<T2>): IPromise<T2>;
    }

}