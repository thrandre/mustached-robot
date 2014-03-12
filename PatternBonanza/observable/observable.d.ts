declare module IObservable {
    interface IEventArgs {
        event: number;
        data: any;
    }

    interface IPropertyChangedEventArgs extends IEventArgs {
        data: IPropertyInfo;
    }

    interface IPropertyInfo {
        segments: string[];
        path: string;
        getValue(target: any): any;
    }
}