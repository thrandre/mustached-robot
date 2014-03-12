module D3ST.Objects {
    export class Scene extends Object3D {
        get object(): THREE.Scene {
            return <THREE.Scene> this.baseObject;
        }

        constructor(scene: Wrappers.IScene) { super(scene); }
    }
} 