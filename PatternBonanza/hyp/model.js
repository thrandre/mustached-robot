var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ConventionBase = (function (_super) {
    __extends(ConventionBase, _super);
    function ConventionBase() {
        _super.apply(this, arguments);
    }
    ConventionBase.prototype.getClassName = function () {
        return this.constructor.toString().match(/function (.*?)\(/)[1];
    };

    ConventionBase.prototype.getEntityName = function () {
        return this.getClassName().replace(/model|collection|viewmodel/i, "");
    };
    return ConventionBase;
})(Observable.Observable);
exports.ConventionBase = ConventionBase;

var Model = (function (_super) {
    __extends(Model, _super);
    function Model() {
        _super.apply(this, arguments);
    }
    Model.prototype.getUrl = function () {
        return "";
    };

    Model.prototype.serialize = function (model) {
        return "";
    };

    Model.prototype.deserialize = function (serialized) {
        return null;
    };
    return Model;
})(ConventionBase);
exports.Model = Model;

var Collection = (function (_super) {
    __extends(Collection, _super);
    function Collection() {
        _super.apply(this, arguments);
        this.models = new Linq.List();
    }
    Collection.prototype.item = function (index) {
        return this.models.item(index);
    };

    Collection.prototype.add = function (model) {
        this.models.add(model);
        this.notifyObservers(new Observable.CollectionChangedEventArgs(new Observable.CollectionChangedInfo(0 /* Add */, model)));
    };

    Collection.prototype.remove = function (index) {
        this.models.remove(index);
        this.notifyObservers(new Observable.CollectionChangedEventArgs(new Observable.CollectionChangedInfo(1 /* Remove */, null)));
    };

    Collection.prototype.each = function (action) {
        return this.models.each(action);
    };

    Collection.prototype.getEnumerator = function () {
        return this.models.getEnumerator();
    };

    Collection.prototype.count = function (predicate) {
        return this.models.count(predicate);
    };

    Collection.prototype.where = function (predicate) {
        return this.models.where(predicate);
    };

    Collection.prototype.firstOrDefault = function (predicate) {
        return this.models.firstOrDefault(predicate);
    };

    Collection.prototype.select = function (selector) {
        return this.models.select(selector);
    };

    Collection.prototype.orderByAscending = function (selector) {
        return this.models.orderByAscending(selector);
    };

    Collection.prototype.orderByDescending = function (selector) {
        return this.models.orderByDescending(selector);
    };

    Collection.prototype.groupBy = function (selector) {
        return this.models.groupBy(selector);
    };

    Collection.prototype.sum = function (selector) {
        return this.models.sum(selector);
    };

    Collection.prototype.toArray = function () {
        return this.models.toArray();
    };

    Collection.prototype.toList = function () {
        return this.models.toList();
    };
    return Collection;
})(ConventionBase);
exports.Collection = Collection;

var UserModel = (function (_super) {
    __extends(UserModel, _super);
    function UserModel() {
        _super.apply(this, arguments);
    }
    return UserModel;
})(Model);
exports.UserModel = UserModel;
var UserCollection = (function (_super) {
    __extends(UserCollection, _super);
    function UserCollection() {
        _super.apply(this, arguments);
    }
    return UserCollection;
})(Collection);
exports.UserCollection = UserCollection;
//# sourceMappingURL=model.js.map
