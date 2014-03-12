module D3ST.Builders {
    export class MeshBuilder {
        private _materialBuilder: MaterialBuilder;
        private _shadow: boolean = true;

        withMaterial(materialBuilder: MaterialBuilder): MeshBuilder {
            this._materialBuilder = materialBuilder;
            return this;
        }

        withShadows(shadows: boolean): MeshBuilder {
            this._shadow = shadows;
            return this;
        }

        create(geometry: THREE.Geometry): Objects.Object3D {
            var o = new Objects.Object3D(new THREE.Mesh(geometry, <any>this._materialBuilder.create()));

            o.object.castShadow = this._shadow;
            o.object.receiveShadow = this._shadow;

            return o;
        }
    }
} 