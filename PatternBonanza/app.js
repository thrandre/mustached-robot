var D3ST;
(function (D3ST) {
    (function (Builders) {
        var MaterialBuilder = (function () {
            function MaterialBuilder() {
                this.color = 0xffffff;
                this.opacity = 1;
                this.transparent = false;
            }
            MaterialBuilder.prototype.withOpacity = function (opacity) {
                this.opacity = opacity;
                return this;
            };

            MaterialBuilder.prototype.withTransparency = function (transparency) {
                this.transparent = transparency;
                return this;
            };

            MaterialBuilder.prototype.withColor = function (color) {
                this.color = color;
                return this;
            };

            MaterialBuilder.prototype.create = function () {
                throw new Error("Abstract base class. Use concrete implementation.");
            };
            return MaterialBuilder;
        })();
        Builders.MaterialBuilder = MaterialBuilder;
    })(D3ST.Builders || (D3ST.Builders = {}));
    var Builders = D3ST.Builders;
})(D3ST || (D3ST = {}));
///<reference path="materialBuilder.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var D3ST;
(function (D3ST) {
    (function (Builders) {
        var BasicMaterialBuilder = (function (_super) {
            __extends(BasicMaterialBuilder, _super);
            function BasicMaterialBuilder() {
                _super.apply(this, arguments);
            }
            BasicMaterialBuilder.prototype.create = function () {
                return new D3ST.Objects.Material(new THREE.MeshBasicMaterial({
                    opacity: this.opacity,
                    transparent: this.transparent,
                    color: this.color
                }));
            };
            return BasicMaterialBuilder;
        })(D3ST.Builders.MaterialBuilder);
        Builders.BasicMaterialBuilder = BasicMaterialBuilder;
    })(D3ST.Builders || (D3ST.Builders = {}));
    var Builders = D3ST.Builders;
})(D3ST || (D3ST = {}));
var D3ST;
(function (D3ST) {
    (function (Builders) {
        var CameraBuilder = (function () {
            function CameraBuilder() {
                this._fov = 35;
                this._aspect = 1.6;
                this._near = 0.1;
                this._far = 1000;
            }
            CameraBuilder.prototype.withFieldOfView = function (fov) {
                this._fov = fov;
                return this;
            };

            CameraBuilder.prototype.withAspectRatio = function (aspect) {
                this._aspect = aspect;
                return this;
            };

            CameraBuilder.prototype.withNear = function (near) {
                this._near = near;
                return this;
            };

            CameraBuilder.prototype.withFar = function (far) {
                this._far = far;
                return this;
            };

            CameraBuilder.prototype.create = function () {
                return new D3ST.Objects.Camera(new THREE.PerspectiveCamera(this._fov, this._aspect, this._near, this._far));
            };
            return CameraBuilder;
        })();
        Builders.CameraBuilder = CameraBuilder;
    })(D3ST.Builders || (D3ST.Builders = {}));
    var Builders = D3ST.Builders;
})(D3ST || (D3ST = {}));
var D3ST;
(function (D3ST) {
    (function (Builders) {
        var MeshBuilder = (function () {
            function MeshBuilder() {
                this._shadow = true;
            }
            MeshBuilder.prototype.withMaterial = function (materialBuilder) {
                this._materialBuilder = materialBuilder;
                return this;
            };

            MeshBuilder.prototype.withShadows = function (shadows) {
                this._shadow = shadows;
                return this;
            };

            MeshBuilder.prototype.create = function (geometry) {
                var o = new D3ST.Objects.Object3D(new THREE.Mesh(geometry, this._materialBuilder.create()));

                o.object.castShadow = this._shadow;
                o.object.receiveShadow = this._shadow;

                return o;
            };
            return MeshBuilder;
        })();
        Builders.MeshBuilder = MeshBuilder;
    })(D3ST.Builders || (D3ST.Builders = {}));
    var Builders = D3ST.Builders;
})(D3ST || (D3ST = {}));
///<reference path="meshBuilder.ts"/>
var D3ST;
(function (D3ST) {
    (function (Builders) {
        var CubeBuilder = (function (_super) {
            __extends(CubeBuilder, _super);
            function CubeBuilder() {
                _super.apply(this, arguments);
                this._size = { width: 1, height: 1, depth: 1 };
                this._subdivisions = { x: 1, y: 1, z: 1 };
            }
            CubeBuilder.prototype.withSize = function (size) {
                this._size = size;
                return this;
            };

            CubeBuilder.prototype.withSubdivision = function (subdivisions) {
                this._subdivisions = subdivisions;
                return this;
            };

            CubeBuilder.prototype.withMaterial = function (materialBuilder) {
                return _super.prototype.withMaterial.call(this, materialBuilder);
            };

            CubeBuilder.prototype.withShadows = function (shadows) {
                return _super.prototype.withShadows.call(this, shadows);
            };

            CubeBuilder.prototype.create = function () {
                return _super.prototype.create.call(this, new THREE.CubeGeometry(this._size.width, this._size.height, this._size.depth, this._subdivisions.x, this._subdivisions.y, this._subdivisions.z));
            };
            return CubeBuilder;
        })(D3ST.Builders.MeshBuilder);
        Builders.CubeBuilder = CubeBuilder;
    })(D3ST.Builders || (D3ST.Builders = {}));
    var Builders = D3ST.Builders;
})(D3ST || (D3ST = {}));
///<reference path="materialBuilder.ts"/>
var D3ST;
(function (D3ST) {
    (function (Builders) {
        var LambertMaterialBuilder = (function (_super) {
            __extends(LambertMaterialBuilder, _super);
            function LambertMaterialBuilder() {
                _super.apply(this, arguments);
            }
            LambertMaterialBuilder.prototype.create = function () {
                return new D3ST.Objects.Material(new THREE.MeshLambertMaterial({
                    opacity: this.opacity,
                    transparent: this.transparent,
                    color: this.color
                }));
            };
            return LambertMaterialBuilder;
        })(D3ST.Builders.MaterialBuilder);
        Builders.LambertMaterialBuilder = LambertMaterialBuilder;
    })(D3ST.Builders || (D3ST.Builders = {}));
    var Builders = D3ST.Builders;
})(D3ST || (D3ST = {}));
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var Object3D = (function () {
            function Object3D(baseObject) {
                this.baseObject = baseObject;
                this.initObservers();
            }
            Object.defineProperty(Object3D.prototype, "object", {
                get: function () {
                    return this.baseObject;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Object3D.prototype, "position", {
                get: function () {
                    return this._position;
                },
                set: function (position) {
                    this._position.setFrom(position);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "rotation", {
                get: function () {
                    return this._rotation;
                },
                set: function (rotation) {
                    this._rotation.setFrom(rotation);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "scale", {
                get: function () {
                    return this._scale;
                },
                set: function (scale) {
                    this._scale.setFrom(scale);
                },
                enumerable: true,
                configurable: true
            });


            Object3D.prototype.addChild = function (child) {
                this.object.add(child.object);
            };

            Object3D.prototype.initObservers = function () {
            };
            return Object3D;
        })();
        Objects.Object3D = Object3D;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
///<reference path="object3d.ts"/>
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var AnimateableObject = (function (_super) {
            __extends(AnimateableObject, _super);
            function AnimateableObject(object) {
                _super.call(this, object);
            }
            return AnimateableObject;
        })(D3ST.Objects.Object3D);
        Objects.AnimateableObject = AnimateableObject;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var Camera = (function (_super) {
            __extends(Camera, _super);
            function Camera(camera) {
                _super.call(this, camera);
            }
            Object.defineProperty(Camera.prototype, "object", {
                get: function () {
                    return this.baseObject;
                },
                enumerable: true,
                configurable: true
            });
            return Camera;
        })(D3ST.Objects.AnimateableObject);
        Objects.Camera = Camera;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var Material = (function () {
            function Material(material) {
                this.material = material;
            }
            Object.defineProperty(Material.prototype, "object", {
                get: function () {
                    return this.material;
                },
                enumerable: true,
                configurable: true
            });
            return Material;
        })();
        Objects.Material = Material;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var Renderer = (function () {
            function Renderer(renderer) {
                this.renderer = renderer;
            }
            Object.defineProperty(Renderer.prototype, "object", {
                get: function () {
                    return this.renderer;
                },
                enumerable: true,
                configurable: true
            });

            Renderer.prototype.render = function (scene, camera) {
            };
            return Renderer;
        })();
        Objects.Renderer = Renderer;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var Scene = (function (_super) {
            __extends(Scene, _super);
            function Scene(scene) {
                _super.call(this, scene);
            }
            Object.defineProperty(Scene.prototype, "object", {
                get: function () {
                    return this.baseObject;
                },
                enumerable: true,
                configurable: true
            });
            return Scene;
        })(D3ST.Objects.Object3D);
        Objects.Scene = Scene;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
var Observable;
(function (_Observable) {
    var Property = (function () {
        function Property(property, getter) {
            this.property = property;
            this.getter = getter;
        }
        return Property;
    })();
    _Observable.Property = Property;

    (function (Event) {
        Event[Event["PropertyChanged"] = 0] = "PropertyChanged";
        Event[Event["CollectionChanged"] = 1] = "CollectionChanged";
    })(_Observable.Event || (_Observable.Event = {}));
    var Event = _Observable.Event;

    (function (CollectionChangeType) {
        CollectionChangeType[CollectionChangeType["Add"] = 0] = "Add";
        CollectionChangeType[CollectionChangeType["Remove"] = 1] = "Remove";
    })(_Observable.CollectionChangeType || (_Observable.CollectionChangeType = {}));
    var CollectionChangeType = _Observable.CollectionChangeType;

    var PropertyInfo = (function () {
        function PropertyInfo(property) {
            this.segments = [];
            this.segments = this.getPropertySegments(property);
        }
        Object.defineProperty(PropertyInfo.prototype, "path", {
            get: function () {
                return this.segments.join(".");
            },
            enumerable: true,
            configurable: true
        });

        PropertyInfo.prototype.getPropertySegments = function (property) {
            return property.toString().replace(/\n|\r|\t|\s{2,}/g, "").match(/function \(\) \{return _this\.(.*?);}/)[1].split(".");
        };

        PropertyInfo.prototype.getValue = function (target) {
            var accessor = target;
            for (var i in this.segments) {
                accessor = accessor[this.segments[i]];
            }
            return accessor;
        };

        PropertyInfo.prototype.combine = function () {
            var parts = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                parts[_i] = arguments[_i + 0];
            }
            for (var i in parts) {
                this.segments = this.segments.concat(parts[i].segments);
            }
            return this;
        };
        return PropertyInfo;
    })();
    _Observable.PropertyInfo = PropertyInfo;

    var CollectionChangedInfo = (function () {
        function CollectionChangedInfo(type, item) {
            this.type = type;
            this.item = item;
        }
        return CollectionChangedInfo;
    })();
    _Observable.CollectionChangedInfo = CollectionChangedInfo;

    var EventArgs = (function () {
        function EventArgs(event, data) {
            this.event = event;
            this.data = data;
        }
        return EventArgs;
    })();
    _Observable.EventArgs = EventArgs;

    var PropertyChangedEventArgs = (function (_super) {
        __extends(PropertyChangedEventArgs, _super);
        function PropertyChangedEventArgs(data) {
            _super.call(this, 0 /* PropertyChanged */, data);
        }
        return PropertyChangedEventArgs;
    })(EventArgs);
    _Observable.PropertyChangedEventArgs = PropertyChangedEventArgs;

    var CollectionChangedEventArgs = (function (_super) {
        __extends(CollectionChangedEventArgs, _super);
        function CollectionChangedEventArgs(data) {
            _super.call(this, 1 /* CollectionChanged */, data);
        }
        return CollectionChangedEventArgs;
    })(EventArgs);
    _Observable.CollectionChangedEventArgs = CollectionChangedEventArgs;

    var Observable = (function () {
        function Observable() {
            this._observerContainer = new ObserverContainer();
        }
        Observable.prototype.notifyObservers = function (eventArgs) {
            this._observerContainer.notify(this, eventArgs);
        };

        Observable.prototype.observe = function (observer) {
            this._observerContainer.add(observer);
            return this;
        };
        return Observable;
    })();
    _Observable.Observable = Observable;

    var ObserverContainer = (function () {
        function ObserverContainer() {
            this._observers = [];
        }
        ObserverContainer.prototype.add = function (observer) {
            var idx = this._observers.indexOf(observer);
            if (idx < 0)
                this._observers.push(observer);
        };

        ObserverContainer.prototype.remove = function (observer) {
            var idx = this._observers.indexOf(observer);
            if (idx > -1)
                this._observers.splice(idx, 1);
        };

        ObserverContainer.prototype.notify = function (observable, eventArgs) {
            for (var i in this._observers)
                this._observers[i](observable, eventArgs);
        };
        return ObserverContainer;
    })();
})(Observable || (Observable = {}));
///<reference path="../../observable/observable.ts"/>
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var Vector3 = (function (_super) {
            __extends(Vector3, _super);
            function Vector3(_wrapped) {
                _super.call(this);
                this._wrapped = _wrapped;
            }
            Object.defineProperty(Vector3.prototype, "x", {
                get: function () {
                    return this._wrapped.x;
                },
                set: function (value) {
                    var _this = this;
                    this._wrapped.x = value;
                    this.notifyObservers(new Observable.PropertyChangedEventArgs(new Observable.PropertyInfo(function () {
                        return _this.x;
                    })));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vector3.prototype, "y", {
                get: function () {
                    return this._wrapped.y;
                },
                set: function (value) {
                    var _this = this;
                    this._wrapped.y = value;
                    this.notifyObservers(new Observable.PropertyChangedEventArgs(new Observable.PropertyInfo(function () {
                        return _this.y;
                    })));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vector3.prototype, "z", {
                get: function () {
                    return this._wrapped.z;
                },
                set: function (value) {
                    var _this = this;
                    this._wrapped.z = value;
                    this.notifyObservers(new Observable.PropertyChangedEventArgs(new Observable.PropertyInfo(function () {
                        return _this.y;
                    })));
                },
                enumerable: true,
                configurable: true
            });

            Vector3.prototype.setFrom = function (vector) {
                this.x = vector.x;
                this.y = vector.y;
                this.z = vector.z;
            };

            Vector3.prototype.asThreeVector = function () {
                return this._wrapped;
            };
            return Vector3;
        })(Observable.Observable);
        Objects.Vector3 = Vector3;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
var D3ST;
(function (D3ST) {
    (function (Objects) {
        var WebGlRenderer = (function (_super) {
            __extends(WebGlRenderer, _super);
            function WebGlRenderer(renderer) {
                _super.call(this, renderer);
            }
            Object.defineProperty(WebGlRenderer.prototype, "object", {
                get: function () {
                    return this.renderer;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(WebGlRenderer.prototype, "domElement", {
                get: function () {
                    return this.object.domElement;
                },
                enumerable: true,
                configurable: true
            });

            WebGlRenderer.prototype.setSize = function (width, height) {
                this.object.setSize(width, height);
            };

            WebGlRenderer.prototype.render = function (scene, camera) {
                this.object.render(scene.object, camera.object);
            };
            return WebGlRenderer;
        })(D3ST.Objects.Renderer);
        Objects.WebGlRenderer = WebGlRenderer;
    })(D3ST.Objects || (D3ST.Objects = {}));
    var Objects = D3ST.Objects;
})(D3ST || (D3ST = {}));
var D3 = D3ST;

console.log("Hepp");
/*export class ConventionBase extends Observable.Observable {
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
export class UserCollection extends Collection<UserModel> { }*/
//# sourceMappingURL=app.js.map
