///<reference path="meshBuilder.ts"/>

module D3ST.Builders {
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

        withMaterial(materialBuilder: MaterialBuilder): CubeBuilder {
            return <CubeBuilder> super.withMaterial(materialBuilder);
        }

        withShadows(shadows: boolean): CubeBuilder {
            return <CubeBuilder> super.withShadows(shadows);
        }

        create(): Objects.Object3D {
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
} 