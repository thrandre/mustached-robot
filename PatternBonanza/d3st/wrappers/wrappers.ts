module D3ST.Wrappers {
    export interface IWrappedVector3 {
        x: number;
        y: number;
        z: number;
    }

    export interface IObject3D {
        position: IWrappedVector3;
        rotation: IWrappedVector3;
        scale: IWrappedVector3;

        castShadow: boolean;
        receiveShadow: boolean;

        add(child: IObject3D);
    }

    export interface ICamera extends IObject3D {}

    export interface IScene extends IObject3D {}

    export interface IRenderer {
        render(scene: IScene, camera: ICamera);
    }

    export interface IWebGlRenderer extends IRenderer {}
    export interface IMaterial {}
}