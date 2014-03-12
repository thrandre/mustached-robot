module D3ST.Objects {
    export class Object3D {

        get object(): Wrappers.IObject3D {
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
        }

        private initObservers() {
        }

        constructor(public baseObject: Wrappers.IObject3D) {
            this.initObservers();
        }

    }
}