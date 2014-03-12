/// <reference path="../typings/three.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../observable/observable"], function(require, exports, Observable) {
    var Object3D = (function (_super) {
        __extends(Object3D, _super);
        function Object3D(baseObject) {
            _super.call(this);
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
            var _this = this;
            this._position = new Vector3(this.object.position);
            this._position.observe(function (v, prop) {
                return _this.notifyObservers(new Observable.PropertyChangedEventArgs(new Observable.PropertyInfo(function () {
                    return _this.position;
                }).combine(prop.data)));
            });

            this._rotation = new Vector3(this.object.rotation);
            this._rotation.observe(function (v, prop) {
                return _this.notifyObservers(new Observable.PropertyChangedEventArgs(new Observable.PropertyInfo(function () {
                    return _this.rotation;
                }).combine(prop.data)));
            });

            this._scale = new Vector3(this.object.scale);
            this._scale.observe(function (v, prop) {
                return _this.notifyObservers(new Observable.PropertyChangedEventArgs(new Observable.PropertyInfo(function () {
                    return _this.scale;
                }).combine(prop.data)));
            });
        };
        return Object3D;
    })(Observable.Observable);
    exports.Object3D = Object3D;

    var AnimateableObject = (function (_super) {
        __extends(AnimateableObject, _super);
        function AnimateableObject(object) {
            _super.call(this, object);
        }
        return AnimateableObject;
    })(Object3D);
    exports.AnimateableObject = AnimateableObject;

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
    })(AnimateableObject);
    exports.Camera = Camera;

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
    })(Object3D);
    exports.Scene = Scene;

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
    exports.Renderer = Renderer;

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
    })(Renderer);
    exports.WebGlRenderer = WebGlRenderer;

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
    exports.Material = Material;

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
            var o = new Object3D(new THREE.Mesh(geometry, this._materialBuilder.create()));

            o.object.castShadow = this._shadow;
            o.object.receiveShadow = this._shadow;

            return o;
        };
        return MeshBuilder;
    })();
    exports.MeshBuilder = MeshBuilder;

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
    })(MeshBuilder);
    exports.CubeBuilder = CubeBuilder;

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
    exports.MaterialBuilder = MaterialBuilder;

    var BasicMaterialBuilder = (function (_super) {
        __extends(BasicMaterialBuilder, _super);
        function BasicMaterialBuilder() {
            _super.apply(this, arguments);
        }
        BasicMaterialBuilder.prototype.create = function () {
            return new Material(new THREE.MeshBasicMaterial({
                opacity: this.opacity,
                transparent: this.transparent,
                color: this.color
            }));
        };
        return BasicMaterialBuilder;
    })(MaterialBuilder);
    exports.BasicMaterialBuilder = BasicMaterialBuilder;

    var LambertMaterialBuilder = (function (_super) {
        __extends(LambertMaterialBuilder, _super);
        function LambertMaterialBuilder() {
            _super.apply(this, arguments);
        }
        LambertMaterialBuilder.prototype.create = function () {
            return new Material(new THREE.MeshLambertMaterial({
                opacity: this.opacity,
                transparent: this.transparent,
                color: this.color
            }));
        };
        return LambertMaterialBuilder;
    })(MaterialBuilder);
    exports.LambertMaterialBuilder = LambertMaterialBuilder;

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
            return new Camera(new THREE.PerspectiveCamera(this._fov, this._aspect, this._near, this._far));
        };
        return CameraBuilder;
    })();
    exports.CameraBuilder = CameraBuilder;
});
//# sourceMappingURL=object3d.js.map
