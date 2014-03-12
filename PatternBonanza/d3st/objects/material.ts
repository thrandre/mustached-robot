module D3ST.Objects {
    export class Material {

        get object(): Wrappers.IMaterial {
            return this.material;
        }

        constructor(public material: Wrappers.IMaterial) {}

    }
}