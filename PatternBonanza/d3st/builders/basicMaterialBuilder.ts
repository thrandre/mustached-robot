///<reference path="materialBuilder.ts"/>

module D3ST.Builders {
    export class BasicMaterialBuilder extends MaterialBuilder {
        create(): Objects.Material {
            return new Objects.Material(
                new THREE.MeshBasicMaterial({
                    opacity: this.opacity,
                    transparent: this.transparent,
                    color: this.color
                }));
        }
    }
} 