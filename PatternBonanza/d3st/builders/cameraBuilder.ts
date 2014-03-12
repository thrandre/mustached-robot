module D3ST.Builders {
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

        create(): Objects.Camera {
            return new Objects.Camera(
                new THREE.PerspectiveCamera(
                    this._fov,
                    this._aspect,
                    this._near,
                    this._far));
        }
    }
} 