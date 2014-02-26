/// <reference path="../typings/three.d.ts"/>

import Observable = require("../observable/observable");

export interface IEquateable<T> {
    equals(other: T): boolean;
}

export interface IWrappedVector3 {
    x: number;
    y: number;
    z: number;
}

export interface IWrappedObject3D {
    position: IWrappedVector3;
    rotation: IWrappedVector3;
    scale: IWrappedVector3;
    add(child: IWrappedObject3D);
}

export interface IWrappedCamera extends IWrappedObject3D { }
export interface IWrappedScene extends IWrappedObject3D { }

export interface IWrappedRenderer {
    render(scene: IWrappedScene, camera: IWrappedCamera);
}

export interface IWrappedWebGlRenderer extends IWrappedRenderer { }

export class Vector3 extends Observable.Observable {
    constructor(private _wrapped: IWrappedVector3) { super(); }

    get x(): number {
        return this._wrapped.x;
    }
    set x(value: number) {
        this._wrapped.x = value;
        this.notifyObservers(() => this.x);
    }

    get y(): number {
        return this._wrapped.y;
    }
    set y(value: number) {
        this._wrapped.y = value;
        this.notifyObservers(() => this.y);
    }

    get z(): number {
        return this._wrapped.z;
    }
    set z(value: number) {
        this._wrapped.z = value;
        this.notifyObservers(() => this.z);
    }

    setFrom(vector: Vector3) {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
    }

    asThreeVector(): IWrappedVector3 {
        return this._wrapped;
    }
}

export class Object3D extends Observable.Observable {
    get object(): IWrappedObject3D {
        return this.baseObject;
    }

    private _position: Vector3;
    get position(): Vector3 {
        return this._position;
    }
    set position(position: Vector3) {
        this._position.setFrom(position);
    }

    private _rotation: Vector3;
    get rotation(): Vector3 {
        return this._rotation;
    }
    set rotation(rotation: Vector3) {
        this._rotation.setFrom(rotation);
    }

    private _scale: Vector3;
    get scale(): Vector3 {
        return this._scale;
    }
    set scale(scale: Vector3) {
        this._scale.setFrom(scale);
    }

    addChild(child: Object3D) {
        this.object.add(child.object);
        this.notifyObservers(() => this.addChild);
    }

    private initObservers() {
        this._position = new Vector3(this.object.position);
        this._position.observe((_, prop) => this.notifyObservers(() => this.position, [prop]));

        this._rotation = new Vector3(this.object.rotation);
        this._rotation.observe((_, prop) => this.notifyObservers(() => this.rotation, [prop]));

        this._scale = new Vector3(this.object.scale);
        this._scale.observe((_, prop) => this.notifyObservers(() => this.scale, [prop]));
    }

    constructor(public baseObject: IWrappedObject3D) {
        super();
        this.initObservers();
    }
}

export class AnimateableObject extends Object3D {
    constructor(object: IWrappedObject3D) { super(object); }
}

export class Camera extends AnimateableObject {
    get object(): IWrappedCamera {
        return <THREE.Camera> this.baseObject;
    }

    constructor(camera: IWrappedCamera) { super(camera); }
}

export class Scene extends Object3D {
    get object(): THREE.Scene {
        return <THREE.Scene> this.baseObject;
    }

    constructor(scene: IWrappedScene) { super(scene); }
}

export class Renderer {
    get object(): IWrappedRenderer {
        return this.renderer;
    }
    
    render(scene: Scene, camera: Camera) {}

    constructor(public renderer: IWrappedRenderer) { }
}

export class WebGlRenderer extends Renderer {
    get object(): THREE.WebGLRenderer {
        return <THREE.WebGLRenderer> this.renderer;
    }

    get domElement(): HTMLCanvasElement {
        return this.object.domElement;
    }

    setSize(width: number, height: number) {
        this.object.setSize(width, height);
    }

    render(scene: Scene, camera: Camera) {
        this.object.render(<any>scene.object, <any>camera.object);
    }

    constructor(renderer: IWrappedWebGlRenderer) { super(renderer); }
}

export interface IWrappedMaterial {}

export class Material {
    get object(): IWrappedMaterial {
        return this.material;
    }

    constructor(public material: IWrappedMaterial) { }
}

export class MeshBuilder {
    private _material: Material;

    withMaterial(materialBuilder: IMaterialBuilder): MeshBuilder {
        this._material = materialBuilder.create().object;
        return this;
    }

    create(geometry: THREE.Geometry): Object3D {
        return new Object3D(new THREE.Mesh(geometry, <any>this._material));
    }
}

export interface ICubeSize {
    width: number;
    height: number;
    depth: number;
}

export interface ICubeSubdivision {
    x: number;
    y: number;
    z: number;
}

export class CubeBuilder extends MeshBuilder {
    private _size: ICubeSize = { width: 1, height: 1, depth: 1 };
    private _subdivisions: ICubeSubdivision = { x: 1, y: 1, z: 1 };

    withSize(size: ICubeSize): CubeBuilder {
        this._size = size;
        return this;
    }

    withSubdivision(subdivisions: ICubeSubdivision): CubeBuilder {
        this._subdivisions = subdivisions;
        return this;
    }

    withMaterial(materialBuilder: IMaterialBuilder): CubeBuilder {
        super.withMaterial(materialBuilder);
        return this;
    }

    create(): Object3D {
        return super.create(
            new THREE.CubeGeometry(
                this._size.width,
                this._size.height,
                this._size.depth,
                this._subdivisions.x,
                this._subdivisions.y,
                this._subdivisions.z));
    }
}

export interface IMaterialBuilder {
    withTransparency(transparency: boolean): IMaterialBuilder;
    withOpacity(opacity: number): IMaterialBuilder;
    create();
}

export class BasicMaterialBuilder implements IMaterialBuilder {
    private _color: number = 0xffffff;
    private _opacity: number = 1;
    private _transparent: boolean = false;

    withOpacity(opacity: number): BasicMaterialBuilder {
        this._opacity = opacity;
        return this;
    }

    withTransparency(transparency: boolean): BasicMaterialBuilder {
        this._transparent = transparency;
        return this;
    }

    withColor(color: number): BasicMaterialBuilder {
        this._color = color;
        return this;
    }

    create(): Material {
        return new Material(
            new THREE.MeshBasicMaterial({
                opacity: this._opacity,
                transparent: this._transparent,
                color: this._color
            }));
    }
}

export class CameraBuilder {
    private _fov: number = 35;
    private _aspect: number = 1.6;
    private _near: number = 0.1;
    private _far: number = 1000;

    withFieldOfView(fov: number): CameraBuilder {
        this._fov = fov;
        return this;
    }

    withAspectRatio(aspect: number): CameraBuilder {
        this._aspect = aspect;
        return this;
    }

    withNear(near: number): CameraBuilder {
        this._near = near;
        return this;
    }

    withFar(far: number): CameraBuilder {
        this._far = far;
        return this;
    }

    create(): Camera {
        return new Camera(
            new THREE.PerspectiveCamera(
                this._fov,
                this._aspect,
                this._near,
                this._far));
    }
}