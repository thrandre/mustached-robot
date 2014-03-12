module D3ST.Objects {
    export class Camera extends AnimateableObject {
        get object(): Wrappers.ICamera {
            return <THREE.Camera> this.baseObject;
        }

        constructor(camera: Wrappers.ICamera) { super(camera); }
    }
} 